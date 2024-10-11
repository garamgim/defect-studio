from fastapi import APIRouter, BackgroundTasks, HTTPException, Request
import os, json

from core.config import settings
import subprocess
from workers.tasks.training import training_task

# 필요 env
'''
OUTPUT_DIR=model, class, instance image -> model load, model save, class_dir save, instance_dir save
DIFFUSERS_TRAIN_PATH= diffusers git repo path
BASE_MODEL_NAME=stable-diffusion-2
'''

router = APIRouter(
    prefix="/dreambooth",
)

training_process = None
log_file_path = None

@router.post("")
async def train_dreambooth(request: Request, background_tasks: BackgroundTasks):
    form = await request.form()

    gpu_device = int(form.get('gpu_device'))

    try:
        # remote 환경
        base_output_dir = settings.OUTPUT_DIR  # /checkpoints

        is_inpaint = form.get('is_inpaint')

        member_id = form.get('member_id')
        train_model_name = form.get("train_model_name")

        # 모델 학습 파라미터
        # 모델 및 토크나이저 설정
        pretrained_model_name_or_path = form.get("pretrained_model_name_or_path")
        revision = form.get("revision")
        tokenizer_name = form.get("tokenizer_name")
        center_crop = form.get("center_crop")

        # 가중치
        resolution = form.get("resolution", 512)

        # 학습 설정
        train_batch_size = form.get("train_batch_size", 2)
        # sample_batch_size = train_batch_size
        num_train_epochs = form.get("num_train_epochs", 50)
        learning_rate = form.get("learning_rate", 5e-6)
        max_train_steps = form.get("max_train_steps")
        gradient_accumulation_steps = form.get("gradient_accumulation_steps", '1')

        scale_lr = form.get("scale_lr")
        lr_scheduler = form.get("lr_scheduler")
        lr_warmup_steps = form.get("lr_warmup_steps")
        lr_num_cycles = form.get("lr_num_cycles")
        lr_power = form.get("lr_power")

        # 최적화 및 정밀도 설정
        use_8bit_adam = form.get("use_8bit_adam")
        gradient_checkpointing = form.get("gradient_checkpointing")
        seed = form.get("seed")
        train_text_encoder = form.get("train_text_encoder")

        adam_beta1 = form.get("adam_beta1")
        adam_beta2 = form.get("adam_beta2")
        adam_weight_decay = form.get("adam_weight_decay")
        adam_epsilon = form.get("adam_epsilon")
        max_grad_norm = form.get("max_grad_norm")

        # 검증 및 체크포인트 설정
        checkpointing_steps = form.get("checkpointing_steps")
        checkpoints_total_limit = form.get("checkpoints_total_limit", None)
        resume_from_checkpoint = form.get("resume_from_checkpoint", None)

        # 기타 설정
        # TODO 후에 local gpu server 사용 시 output_dir 사용
        # output_dir = form.get("output_dir")
        # instance_data_dir = form.get("instance_data_dir", None)
        # class_data_dir = form.get("class_data_dir", None)

        # log_epochs = form.get("log_epochs")

        instance_image_list = form.getlist("instance_image_list")
        class_image_list = form.getlist("class_image_list")

        output_dir = os.path.join(base_output_dir, f"{member_id}", f"{train_model_name}")
        os.makedirs(output_dir, exist_ok=True)

        # multi_concept 관련 코드
        concept_list = form.get("concept_list", [])
        # print(concept_list)
        # concept_list = json.loads(concept_list)

        try:
            concept_list = json.loads(concept_list)  # 문자열을 Python 객체로 변환
        except json.JSONDecodeError as e:
            print(f"JSON 디코딩 오류: {e}")

        instance_image_offset = 0
        class_image_offset = 0
        prior_flag = False
        concepts_list = []
        num_class_images = 100

        for i, concept in enumerate(concept_list):
            instance_count = concept["instance_image_count"]
            class_count = concept["class_image_count"]
            num_class_images = min(num_class_images, class_count)

            if class_count > 0:
                prior_flag = True

            # 인스턴스 이미지 개수에 맞춰 슬라이싱
            instance_images = instance_image_list[instance_image_offset:instance_image_offset + instance_count]
            instance_image_offset += instance_count

            # 클래스 이미지 개수에 맞춰 슬라이싱
            class_images = class_image_list[class_image_offset:class_image_offset + class_count]
            class_image_offset += class_count

            instance_dir = os.path.join(base_output_dir, f"{member_id}", f"{train_model_name}", f"instance_data_dir_{i + 1}")
            class_dir = os.path.join(base_output_dir, f"{member_id}", f"{train_model_name}", f"class_data_dir_{i + 1}")
            os.makedirs(instance_dir, exist_ok=True)
            os.makedirs(class_dir, exist_ok=True)

            # 인스턴스 이미지 저장
            for image in instance_images:
                instance_image_path = os.path.join(instance_dir, image.filename)
                with open(instance_image_path, "wb") as f:
                    f.write(await image.read())

            # 클래스 이미지 저장
            for image in class_images:
                class_image_path = os.path.join(class_dir, image.filename)
                with open(class_image_path, "wb") as f:
                    f.write(await image.read())

            concepts_list.append({
                "instance_prompt": concept["instance_prompt"],
                "class_prompt": concept["class_prompt"],
                "instance_data_dir": instance_dir,
                "class_data_dir": class_dir
            })
        print(concepts_list)
        concept_list_json_path = os.path.join(base_output_dir, f"{member_id}", f"{train_model_name}", "concept_list.json")
        with open(concept_list_json_path, "w") as f:
            json.dump(concepts_list, f, indent=4)

        with_prior_preservation = False
        prior_loss_weight = None

        if prior_flag:
            with_prior_preservation = True
            prior_loss_weight = form.get("prior_loss_weight", "1.0")

        if pretrained_model_name_or_path.startswith("hub/"):
            pretrained_model_name_or_path = pretrained_model_name_or_path[len("hub/"):]
        elif pretrained_model_name_or_path in settings.BASE_MODEL_NAME.split("|"):
            pretrained_model_name_or_path = os.path.join(base_output_dir, pretrained_model_name_or_path)
        else:
            pretrained_model_name_or_path = os.path.join(base_output_dir, f"{member_id}", pretrained_model_name_or_path)

        train_script = settings.MULTI_CONCEPT_TRAIN_PATH

        # TODO LOG 관련 기능 미사용 중
        # log_file_path = os.path.join(base_output_dir, f"{member_id}", "training.log")

        # 필수 파라미터 추가
        command = [
            "accelerate", "launch", "--num_processes=1", str(train_script),
            "--pretrained_model_name_or_path", str(pretrained_model_name_or_path),
            "--gpu_device", str(gpu_device),
            "--output_dir", str(output_dir),
            "--resolution", str(resolution),
            "--train_batch_size", str(train_batch_size),
            "--gradient_accumulation_steps", str(gradient_accumulation_steps),
            "--learning_rate", str(learning_rate),
            "--num_train_epochs", str(num_train_epochs),
            "--concepts_list", str(concept_list_json_path)
        ]

        if is_inpaint:
            command.append("--is_inpaint")
        if with_prior_preservation:
            command.extend(["--num_class_images", str(num_class_images)])
            command.append("--with_prior_preservation")
            command.extend(["--prior_loss_weight", str(prior_loss_weight)])

        # 선택적 파라미터 추가
        if gradient_checkpointing:
            command.extend(["--gradient_checkpointing"])
        if use_8bit_adam:
            command.append("--use_8bit_adam")
        if lr_scheduler:
            command.extend(["--lr_scheduler", str(lr_scheduler)])
        if lr_warmup_steps:
            command.extend(["--lr_warmup_steps", str(lr_warmup_steps)])
        if revision is not None:
            command.extend(["--revision", str(revision)])
        if tokenizer_name is not None:
            command.extend(["--tokenizer_name", str(tokenizer_name)])
        if center_crop is not None:
            command.append("--center_crop")
        if seed is not None:
            command.extend(["--seed", str(seed)])
        if train_text_encoder is not None:
            command.append("--train_text_encoder")
        if max_train_steps is not None:
            command.extend(["--max_train_steps", str(max_train_steps)])
        if checkpointing_steps is not None:
            command.extend(["--checkpointing_steps", str(checkpointing_steps)])
        if checkpoints_total_limit is not None:
            command.extend(["--checkpoints_total_limit", str(checkpoints_total_limit)])
        if resume_from_checkpoint is not None:
            command.extend(["--resume_from_checkpoint", str(resume_from_checkpoint)])
        if adam_beta1 is not None:
            command.extend(["--adam_beta1", str(adam_beta1)])
        if adam_beta2 is not None:
            command.extend(["--adam_beta2", str(adam_beta2)])
        if adam_weight_decay is not None:
            command.extend(["--adam_weight_decay", str(adam_weight_decay)])
        if adam_epsilon is not None:
            command.extend(["--adam_epsilon", str(adam_epsilon)])
        if max_grad_norm is not None:
            command.extend(["--max_grad_norm", str(max_grad_norm)])
        '''
        Local 사용 시 사용 고려
        if not output_dir:
            command.extend(["--output_dir", output_dir])
        '''
        if scale_lr and scale_lr.lower() != "false":
            command.append("--scale_lr")
        if lr_num_cycles is not None:
            command.extend(["--lr_num_cycles", str(lr_num_cycles)])
        if lr_power is not None:
            command.extend(["--lr_power", str(lr_power)])

        if os.name == 'nt':
            command = ['cmd', '/c'] + command

        kwargs = {
            'model': train_model_name,
            'command': command,
            'output_dir': output_dir,
            'gpu_device': gpu_device,
            'cost': form.get("cost")
        }

        task = training_task.apply_async(kwargs=kwargs)

        return {"task_id": task.id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def run_training(command):
    try:
        training_process = subprocess.Popen(command)
        training_process.wait()
    except subprocess.CalledProcessError as e:
        print(f"Error occurred while executing command: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


# 향후 status 확인 필요 시 사용
@router.get("/training_status/")
async def training_status():
    global training_process, log_file_path

    if training_process is None:
        raise HTTPException(status_code=400, detail="Training has not started yet.")

    poll = training_process.poll()
    if poll is None:
        status = "Training is still running."
    else:
        status = "Training has completed."

    log_content = ""
    if os.path.exists(log_file_path):
        with open(log_file_path, "r") as log_file:
            log_content = log_file.read()

    return {
        "status": status,
        "log": log_content
    }

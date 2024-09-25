import { Button, Select, message } from 'antd';
import { ApproveGuestUserProps, MemberRead, RoleType } from '../../api/guestUser';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { approveGuestUser, rejectGuestUser, RejectGuestUserProps } from '../../api/guestUser';
import { AxiosResponse } from 'axios';
// 표 전용
type TableMemberType = {
  key: React.Key;
} & MemberRead;

// Props
interface GuestUserItemProps {
  guestData: TableMemberType;
}

const GuestUserItem = ({ guestData }: GuestUserItemProps) => {
  const queryClient = useQueryClient();
  const [newRole, setNewRole] = useState<RoleType>('guest');

  //   승인요청함수
  const { mutate: approveMutate, isPending: approveIsPending } = useMutation<
    AxiosResponse<string>,
    Error,
    ApproveGuestUserProps
  >({
    mutationFn: approveGuestUser,
    onSuccess: () => {
      message.success('Approved');
      queryClient.invalidateQueries({
        queryKey: ['guest_user_info']
      });
    },
    onError: (error) => {
      message.error(error.message || 'Something went wrong. Try again later');
    }
  });

  // 거절 요청 함수
  const { mutate: rejectMutate, isPending: rejectIsPending } = useMutation<
    AxiosResponse<string>,
    Error,
    RejectGuestUserProps
  >({
    mutationFn: rejectGuestUser,
    onSuccess: () => {
      message.success('Rejected Guest User');
      queryClient.invalidateQueries({
        queryKey: ['guest_user_info']
      });
    }
  });

  return (
    <div className="flex flex-row justify-between">
      <div>
        <Select onChange={setNewRole} className="w-[200px]">
          <Select.Option value={'department_member'}>department_member</Select.Option>
          <Select.Option value={'department_admin'}>department_admin</Select.Option>
          <Select.Option value={'super_admin'}>super_admin</Select.Option>
        </Select>
      </div>
      <div className="flex flex-row ">
        {!approveIsPending && !rejectIsPending && (
          <>
            <Button
              onClick={() => {
                // console.log(guestData, newRole);
                approveMutate({ member_id: guestData.member_id, new_role: newRole });
              }}
              disabled={newRole === 'guest'}
              className="mx-3 disabled:hidden"
            >
              Approve
            </Button>
            <Button
              onClick={() => {
                // console.log(guestData, newRole);
                rejectMutate({ member_id: guestData.member_id });
              }}
              className="mx-3 disabled:hidden"
            >
              Reject
            </Button>
          </>
        )}
        {(approveIsPending || rejectIsPending) && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default GuestUserItem;
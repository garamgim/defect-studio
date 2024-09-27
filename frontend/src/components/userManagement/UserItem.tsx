import { Button, Select, message } from 'antd';
import { ApproveGuestUserProps, MemberRead, RoleType } from '../../api/UserManagement';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { approveUser, rejectUser, RejectGuestUserProps } from '../../api/UserManagement';
import { AxiosResponse } from 'axios';
// 표 전용
type TableMemberType = {
  key: React.Key;
} & MemberRead;

// Props
interface GuestUserItemProps {
  userData: TableMemberType;
}

const UserItem = ({ userData }: GuestUserItemProps) => {
  const queryClient = useQueryClient();
  const [newRole, setNewRole] = useState<RoleType>('guest');

  //   승인요청함수
  const { mutate: approveMutate, isPending: approveIsPending } = useMutation<
    AxiosResponse<string>,
    Error,
    ApproveGuestUserProps
  >({
    mutationFn: approveUser,
    onSuccess: () => {
      message.success('Approved');
      queryClient.invalidateQueries({
        queryKey: ['guest_user_info']
      });
      queryClient.invalidateQueries({
        queryKey: ['user_info_list']
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
    mutationFn: rejectUser,
    onSuccess: () => {
      message.success('Removed User Account');
      queryClient.invalidateQueries({
        queryKey: ['guest_user_info']
      });
      queryClient.invalidateQueries({
        queryKey: ['user_info_list']
      });
    }
  });

  return (
    <div className="flex flex-row justify-between">
      <div>
        <Select onChange={setNewRole} defaultValue={userData.role} className="w-[200px]">
          <Select.Option value={'department_member'}>department_member</Select.Option>
          <Select.Option value={'department_admin'}>department_admin</Select.Option>
          <Select.Option value={'super_admin'}>super_admin</Select.Option>
          <Select.Option value={'guest'}>guest</Select.Option>
        </Select>
      </div>
      <div className="flex flex-row ">
        {!approveIsPending && !rejectIsPending && (
          <>
            <Button
              onClick={() => {
                // console.log(guestData, newRole);
                approveMutate({ member_id: userData.member_id, new_role: newRole });
              }}
              disabled={newRole === 'guest'}
              className="mx-3 disabled:hidden"
            >
              Change Role
            </Button>
            <Button
              onClick={() => {
                // console.log(userData, newRole);
                rejectMutate({ member_id: userData.member_id });
              }}
              className="mx-3 disabled:hidden"
            >
              Delete Member
            </Button>
          </>
        )}
        {(approveIsPending || rejectIsPending) && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default UserItem;

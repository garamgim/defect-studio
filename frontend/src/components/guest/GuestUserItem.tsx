import { Button, Select, message } from 'antd';
import { ApproveGuestUserProps, MemberRead, RoleType } from '../../api/guestUser';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { approveGuestUser } from '../../api/guestUser';
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

  //   요청함수
  const { mutate: approveMutate, isPending: approveIsPending } = useMutation<
    AxiosResponse<unknown>,
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
        {!approveIsPending && (
          <>
            <Button
              onClick={() => {
                approveMutate({ member_pk: guestData.member_pk, new_role: newRole });
              }}
              disabled={newRole === 'guest'}
              className="mx-3 disabled:hidden"
            >
              Approve
            </Button>
            <Button>Reject</Button>
          </>
        )}
        {approveIsPending && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default GuestUserItem;

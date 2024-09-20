import { AxiosResponse } from 'axios';
import { getGuestUserInfo, MemberRead, RoleType } from '../../api/guestUser';
import { useQuery } from '@tanstack/react-query';
import { Table } from 'antd';
import React, { useRef, useState } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import { Button, Input, Space } from 'antd';
import type { InputRef, TableColumnsType, TableColumnType } from 'antd';
import Highlighter from 'react-highlight-words';

// 표 전용
type TableMemberType = {
  key: React.Key;
} & MemberRead;

type DataIndex = keyof Pick<MemberRead, 'nickname' | 'department_name' | 'email'>; // Table 표 Colums 검색전용 데이터 인덱스 타입

const GuestUserList = () => {
  // Guest Member 정보 가져오기
  const { data, isPending, isError, error } = useQuery<AxiosResponse<MemberRead[]>, Error, TableMemberType[], string[]>(
    {
      queryKey: ['guest_user_info'],
      queryFn: getGuestUserInfo,
      select: (response) => response.data.map((member) => ({ ...member, key: member.member_pk })),
      staleTime: 1000 * 60 * 10, // 10분
      gcTime: 1000 * 60 * 20 // 20분
    }
  );

  //   검색 관련 필수
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  //   검색 관련 함수
  const handleSearch = (selectedKeys: string[], confirm: FilterDropdownProps['confirm'], dataIndex: DataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  //   검색 전용
  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      )
  });

  // Table 표 Colums 정의
  const columns: TableColumnsType<TableMemberType> = [
    {
      title: 'Nickname',
      dataIndex: 'nickname',
      key: 'nickname',
      ...getColumnSearchProps('nickname'),
      sorter: (a, b) => a.nickname.localeCompare(b.nickname),
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'Department',
      dataIndex: 'department_name',
      key: 'department_name',
      ...getColumnSearchProps('department_name'),
      sorter: (a, b) => a.department_name.localeCompare(b.department_name),
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email'),
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortDirections: ['descend', 'ascend']
    }
  ];

  return (
    <main className="flex flex-col  w-full content-box">
      {isPending && <div>Loading...</div>}
      {isError && <div>Error</div>}
      {data && (
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            defaultPageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '15', '20']
          }}
        />
      )}
    </main>
  );
};

export default GuestUserList;

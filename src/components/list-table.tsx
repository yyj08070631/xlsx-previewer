"use client"

import React from "react"
import { Button, Modal, Space, Table, message } from "antd"
import { TableColumnsType, TableProps } from "antd"

const useColumns = (refresh: Function, del: Function) => {
  const columns: TableColumnsType = [
    { title: "id", dataIndex: "id" },
    { title: "name", dataIndex: "name" },
    { title: "data", dataIndex: "data", render: () => "Object" },
    {
      title: "created_at",
      dataIndex: "created_at",
      render: (value) => value.toJSON(),
    },
    {
      title: "action",
      render: (value, row) => (
        <Space>
          <Button href={`/app/detail/${row.id}`} target="_blank">
            查看
          </Button>
          <Button
            onClick={() => {
              Modal.confirm({
                title: "确认删除?",
                onOk: async () => {
                  try {
                    await del(row.id)
                    refresh()
                    message.success("删除成功")
                  } catch (e: any) {
                    message.error(e?.message ?? "删除失败")
                  }
                },
              })
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]
  return [columns]
}

const onChange: TableProps["onChange"] = (
  pagination,
  filters,
  sorter,
  extra
) => {
  console.log("params", pagination, filters, sorter, extra)
}

interface Props {
  data: any[]
  loading: boolean
  del: Function
  refresh: Function
}
const App: React.FC<Props> = ({ data, loading, del, refresh }) => {
  const [columns] = useColumns(refresh, del)

  return (
    <Table
      loading={loading}
      columns={columns}
      dataSource={data}
      rowKey={"id"}
      pagination={{ pageSize: 10 }}
      onChange={onChange}
    />
  )
}

export default App

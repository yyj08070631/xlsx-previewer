"use client"

import React, { useEffect, useState } from "react"
import { Button, Modal, Space, Table, message } from "antd"
import { TableProps } from "antd"
import { EditModal } from "./edit-modal"
import dayjs from "dayjs"

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
  const [currRow, setCurrRow] = useState<any>()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (currRow) {
      setVisible(true)
    }
  }, [currRow])

  return (
    <>
      <Table
        loading={loading}
        columns={[
          { title: "id", dataIndex: "id" },
          { title: "name", dataIndex: "name" },
          {
            title: "created_at",
            dataIndex: "created_at",
            render: (value) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
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
                    if (currRow === row) {
                      setVisible(true)
                    } else {
                      setCurrRow(row)
                    }
                  }}
                >
                  编辑
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
        ]}
        dataSource={data}
        rowKey={"id"}
        pagination={{ pageSize: 10 }}
        onChange={onChange}
      />

      <EditModal
        visible={visible}
        currRow={currRow}
        updateList={refresh}
        setVisible={setVisible}
      />
    </>
  )
}

export default App

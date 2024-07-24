"use client"

import React, { useState } from "react"
import { Button, Modal, Space, Table, message } from "antd"
import { Image, TableColumnsType, TableProps } from "antd"

interface DataType {
  id: number
  name: string
  data: any
  created_at: string
}

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

const expandedRowRender = (row: DataType) => {
  const expandedColumns: TableColumnsType = Object.keys(
    row?.data?.[0] ?? {}
  ).map((key) => {
    const needSort = ["求和项:install", "求和项:revenue"].includes(key)
    const needFilter = ["mtg_category_level_1"].includes(key)
    return {
      title: key,
      dataIndex: key,
      showSorterTooltip: { target: "full-header" },
      sorter: needSort ? (v1, v2) => v1[key] - v2[key] : false,
      filters: needFilter
        ? Object.values(
            row?.data?.reduce((accu: any, curr: any) => {
              if (!accu[key]) {
                accu[key] = { text: curr[key], value: curr[key] }
              }
              return accu
            }, {}) ?? {}
          )
        : undefined,
      filterMode: "tree",
      filterSearch: needFilter,
      onFilter: (value, record) => record[key].startsWith(value as string),
      render:
        key === "creative_url"
          ? (v) => <Image src={v} width={200} alt="" />
          : key === "preview_url"
          ? (v) => (
              <a href={v} target="_blank">
                {v}
              </a>
            )
          : (v) => v,
    }
  })

  return (
    <Table
      columns={expandedColumns}
      dataSource={row.data}
      pagination={{ pageSize: 10 }}
      rowKey={() => window.crypto.randomUUID()}
      scroll={{ x: true }}
      className="w-[calc(100vw-168px)]"
    />
  )
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
      expandable={{ expandedRowRender }}
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

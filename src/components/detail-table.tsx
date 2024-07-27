import { TableColumnsType, Image, Table } from "antd"
import { FC } from "react"

interface DetailTableProps {
  row: any
  loading: boolean
}
export const DetailTable: FC<DetailTableProps> = ({ row, loading }) => {
  const expandedColumns: TableColumnsType = Object.keys(
    row?.data?.[0] ?? {}
  ).map((key) => {
    const needSort = ["求和项:install", "求和项:revenue"].includes(key)
    const needFilter = [
      "mtg_category_level_1",
      "mtg_category_level_2",
      "mtg_category_level_3",
      "mtg_sub_category",
      "mtg_project_tag",
      "platform",
    ].includes(key)
    return {
      title: key,
      dataIndex: key,
      showSorterTooltip: { target: "full-header" },
      sorter: needSort ? (v1, v2) => v1[key] - v2[key] : false,
      filters: needFilter
        ? Object.values(
            row?.data?.reduce((accu: any, curr: any) => {
              if (!accu[curr[key]]) {
                accu[curr[key]] = { text: curr[key], value: curr[key] }
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
      dataSource={row?.data ?? []}
      pagination={{
        pageSize: 20,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} items`,
      }}
      rowKey={() => window.crypto.randomUUID()}
      scroll={{ x: true }}
      loading={loading}
      className="w-[calc(100vw-168px)]"
    />
  )
}

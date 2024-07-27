import { Button, Form, Input, Modal, message } from "antd"
import { useForm } from "antd/es/form/Form"
import { XUpload } from "./upload"
import { useState } from "react"
import { add } from "@/db/sql"

interface AddModalProps {
  visible?: boolean
  updateList?: Function
  setVisible?: Function
}
export const AddModal = ({
  visible,
  updateList,
  setVisible,
}: AddModalProps) => {
  const [form] = useForm()
  const [submitting, setSubmitting] = useState(false)

  const closeModal = () => {
    setVisible?.(false)
    form.resetFields()
  }

  return (
    <Modal title="新增表格" open={visible} footer={null} onCancel={closeModal}>
      <Form
        form={form}
        layout="vertical"
        onFinish={async (values) => {
          const formData = new FormData()
          formData.set("name", values.name)
          formData.set("file", values.files[0])
          try {
            setSubmitting(true)
            await add(formData)
            message.success("上传成功")
            updateList?.()
            closeModal()
          } catch (e: any) {
            message.error(e?.message ?? "上传失败")
          } finally {
            setSubmitting(false)
          }
        }}
      >
        <Form.Item
          label={"表格名称"}
          name={["name"]}
          rules={[{ required: true, message: "请输入表格名称" }]}
        >
          <Input placeholder="请输入表格名称" />
        </Form.Item>
        <Form.Item
          label={"源文件"}
          name={["files"]}
          rules={[{ required: true, message: "请上传源文件" }]}
        >
          <XUpload />
        </Form.Item>
        <Form.Item className="flex justify-end">
          <Button type="primary" htmlType="submit" loading={submitting}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

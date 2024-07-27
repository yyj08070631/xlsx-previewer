import { Button, Upload } from "antd"
import { RcFile, UploadFile } from "antd/es/upload"

interface XUploadProps {
  value?: UploadFile[]
  onChange?: (files: (string | Blob | RcFile)[]) => void
}
export const XUpload = ({ value, onChange }: XUploadProps) => {
  return (
    <Upload
      fileList={value}
      maxCount={1}
      customRequest={async (opt) => {
        onChange?.([opt.file])
      }}
      onRemove={() => onChange?.([])}
    >
      <Button>上传文件</Button>
    </Upload>
  )
}

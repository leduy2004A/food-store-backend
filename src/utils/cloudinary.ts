import { v2 as cloudinary } from 'cloudinary'
cloudinary.config({
  cloud_name: 'dlzfanxoh',
  api_key: '483144175387637',
  api_secret: 'AY8la4kY9zw_AetWdYspyOEreOY'
})

export const cloudinaryUploadeImage = ({ filepath, filename }: { filepath: string; filename: string }) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filepath,
      { public_id: filename, folder: 'food-store' },
      function (error: any, result: any) {
        if (error) {
          reject(error) // Trả về lỗi nếu có lỗi xảy ra
        } else {
          resolve(result) // Trả về kết quả nếu thành công
        }
      }
    )
  })
}

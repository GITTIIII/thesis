import Image from 'next/image'
import documentation from "@/../../public/asset/documentation.png"
import AdminTable from '@/components/adminTable/adminTable'

const Admin = () => {
  return (
    <>
    <div className='w-full h-full bg-transparent py-8 px-28'>
      <div className='h-max w-full flex items-center text-2xl p-2'>
        <Image
        src={documentation}
        width={142}
        height={142}
        alt="documentation"
        />
        <label className='ml-5'>เอกสารที่ต้องอนุมัติ</label>
      </div>
      <div className='h-3/4 w-full flex items-center'>
        <AdminTable/>
      </div>
    </div>
    </>
  )
}

export default Admin
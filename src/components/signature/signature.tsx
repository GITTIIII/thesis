import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { useState } from "react";
import signature from "@/../../public/asset/signature.png"
import signature_head from "@/../../public/asset/signature_head.png"
import folderOrange from "@../../../public/asset/folderOrange.png"
import folderBlack from "@../../../public/asset/folderBlack.png"
import penOrange from "@../../../public/asset/penOrange.png"
import penBlack from "@../../../public/asset/penBlack.png"
import uploadOrange from "@../../../public/asset/uploadOrange.png"
import uploadBlack from "@../../../public/asset/uploadBlack.png"
import {RadioGroup, Radio} from "@nextui-org/radio";


export default function Signature({onAddSignature}:{onAddSignature: (signature: string) => void}) {
    const [popUp, setPopUp] = useState(false);
    const [active, setActive] = useState(1);

    const onSubmit = async () => {
        // create sig 
        // onAddSignature()
    }

    return (
        <>
            <Button variant='outline' onClick={() => setPopUp(!popUp)} className="w-2/5 mt-4 h-max">
                <Image
                    src={signature_head}
                    width={100}
                    height={100}
                    alt="leaning1"
                />
            </Button>
            {popUp && (
                <div className="w-full h-full bg-[#060505c2] flex top-0 left-0 m-auto fixed z-50 px-0 md:px-10 lg:40 2xl:px-96 py-20">
                    <div className="w-full h-max bg-[#ffffff] p-8 rounded-sm">
                        <div className="w-full flex items-center">
                            <Image
                                src={signature}
                                width={50}
                                height={50}
                                alt="signature"
                            />
                            <label className="ml-4 font-bold text-2xl">ลายเซ็น</label>
                        </div>
                        {/* main */}
                        <div className="w-full h-max mt-2 flex">
                            <button onClick={()=>setActive(1)} className={`w-full 2xl:w-1/5 flex justify-center items-center text-sm bg-white-500 border-black p-2 ${active === 1 ? 'border-x border-t border-b-white text-[#F26522]' : 'border-b'}`}>
                                <Image
                                    src={active === 1 ? folderOrange : folderBlack}
                                    className="w-8 h-8 md:w-16 md:h-16"
                                    alt="signature"
                                />
                                <label className="ml-2">ลายเซ็นของคุณ</label>
                            </button>
                            <button onClick={()=>setActive(2)} className={`w-full 2xl:w-1/5 flex justify-center items-center text-sm bg-white-500 border-black p-2 ${active === 2 ? 'border-x border-t border-b-white text-[#F26522]' : 'border-b'}`}>
                                <Image
                                    src={active === 2 ? penOrange : penBlack}
                                    className="w-8 h-8 md:w-16 md:h-16"
                                    alt="pen"
                                />
                                <label className="ml-2">วาดลายเซ็นตัวเอง</label>
                            </button>
                            <button onClick={()=>setActive(3)} className={`w-full 2xl:w-1/5 flex justify-center items-center text-sm bg-white-500 border-black p-2 ${active === 3 ? 'border-x border-t border-b-white text-[#F26522]' : 'border-b'}`}>
                                <Image
                                    src={active === 3 ? uploadOrange : uploadBlack}
                                    className="w-8 h-8 md:w-16 md:h-16"
                                    alt="upload"
                                />
                                <label className="ml-2">อัปโหลดรูปภาพ</label>
                            </button>
                            <div className="bg-white-500 border-b border-black w-0  2xl:w-1/5 py-4"></div>
                            <div className="bg-white-500 border-b border-black w-0  2xl:w-1/5 py-4"></div>
                        </div>
                        <div className="w-full h-1/5 bg-[#55fff6] p-2 overflow-auto">
                            {active==1 && (
                                <div className="w-full h-full grid sm:grid-cols-3 2xl:grid-cols-5 gap-2">
                                    <div className="w-full bg-blue-500 flex justify-center">
                                    <Image
                                        src={signature}
                                        width={200}
                                        height={200}
                                        alt="signature"
                                    />
                                    </div>
                                    {/* <div className="w-full bg-blue-500 flex justify-center">
                                    <Image
                                        src={signature}
                                        width={200}
                                        height={200}
                                        alt="signature"
                                    />
                                    </div>
                                    <div className="w-full bg-blue-500 flex justify-center">
                                    <Image
                                        src={signature}
                                        width={200}
                                        height={200}
                                        alt="signature"
                                    />
                                    </div>
                                    <div className="w-full bg-blue-500 flex justify-center">
                                    <Image
                                        src={signature}
                                        width={200}
                                        height={200}
                                        alt="signature"
                                    />
                                    </div>
                                    <div className="w-full bg-blue-500 flex justify-center">
                                    <Image
                                        src={signature}
                                        width={200}
                                        height={200}
                                        alt="signature"
                                    />
                                    </div> */}
                                </div>
                            )}
                            {active==2 && (
                                <div className="w-full h-max">
                                    2
                                </div>
                            )}
                            {active==3 && (
                                <div className="w-full h-max">
                                    3
                                </div>
                            )}
                        </div>
                        <Button onClick={()=> setPopUp(!popUp)}>
                            ปิด
                        </Button>
                    </div>
                </div>
            )}
        </>
    )
}

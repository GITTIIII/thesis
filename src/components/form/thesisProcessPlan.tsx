import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { GoGrabber, GoPlus, GoX } from "react-icons/go";
import { IProcessPlan } from "@/interface/form";

interface ITemplateList {
  processPlan: IProcessPlan;
  setData: React.Dispatch<React.SetStateAction<IProcessPlan[]>>;
  fixedindexs: number[];
  updateFixedindex: (processPlan: IProcessPlan[]) => void;
  degree: string | undefined;
  months: number;
  canEdit: boolean;
  index: number;
}

export default function ThesisProcessPlan({
  degree,
  canEdit = false,
  processPlans,
  setProcessPlans,
}: {
  canEdit?: boolean;
  degree: string;
  processPlans: IProcessPlan[];
  setProcessPlans?: React.Dispatch<React.SetStateAction<IProcessPlan[] | undefined>>;
}) {
  const [months, setMonths] = useState<number>(0);
  const [data, setData] = useState<IProcessPlan[]>(processPlans);
  const [fixedindexs, setFixedindexs] = useState<number[]>([]);

  useEffect(() => {
    if (setProcessPlans !== undefined) {
      setProcessPlans((prevprocessPlans) => {
        setData(prevprocessPlans!);
        console.log(processPlans);
        return processPlans;
      });
    } else setData(processPlans);
    updateFixedindex(data);
    setMonths(() => {
      return degree === "Master" ? 12 : 36;
    });
  }, []);
  useEffect(() => {
    if (setProcessPlans !== undefined) {
      // setProcessPlans(data.filter((item) => item.step !== ""));
      setProcessPlans(data);
    }
    console.log(data.filter((item) => item.step !== ""));
  }, [data]);
  // อัพเดท index สำหรับ อันแรก และ 4 อันสุดท้าย เอาไว้ไม่ให้สามารถ drag and drop
  const updateFixedindex = (processPlan: IProcessPlan[]) => {
    const length = processPlan.length;
    if (length != 5) setFixedindexs([0, length - 4, length - 3, length - 2, length - 1]);
  };
  // หลัง dran and drop เสร็จให้เปลี่ยน index
  function handleOnDragEnd(result: DropResult) {
    if (!result.destination) return;
    if (fixedindexs.includes(result.source.index) || fixedindexs.includes(result.destination.index)) {
      return;
    }
    const items = Array.from(data);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setData(items);
  }
  const AddList = () => {
    return (
      <div
        className="border h-12 flex items-center justify-center rounded-md border-dashed bg-background border-[#a67436] mt-3 hover:bg-muted/50 transition-colors"
        onClick={() =>
          setData((prevList) => {
            const osLength = prevList!.length;
            const newList = [...prevList!];
            newList.splice(osLength - 4, 0, {
              step: ``,
              months: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            });
            updateFixedindex(newList);
            return newList;
          })
        }
      >
        <GoX
          size={30}
          style={{
            color: "#a67436",
            transform: "rotate(45deg)",
          }}
        />
      </div>
    );
  };

  return (
    <div className=" overflow-y-auto">
      <div className=" w-fit">
        <div className=" flex pb-2  border-b border-t-1 border-[#eeee] ">
          <p className=" w-[500px] text-[14px] text-center self-center">กิจกรรม / ขั้นตอนการดำเนินงาน</p>
          <div className=" text-center ">
            <p>เดือนที่</p>
            {degree === "Master" ? (
              <div className=" inline-flex ">
                {Array.from({ length: months }).map((_, index) => (
                  <p key={index} className="text-center text-[14px] w-20">
                    {`${index + 1}`}
                  </p>
                ))}
              </div>
            ) : (
              <div className="inline-flex">
                {Array.from({ length: months }).map(
                  (_, index) =>
                    (index + 1) % 3 === 0 && (
                      <p key={index} className="text-center text-[14px] w-20">
                        {`${index + 1}`}
                      </p>
                    )
                )}
              </div>
            )}
          </div>
        </div>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="operationSteps" type="group">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {data.map((ProcessPlan, index) => (
                  <Draggable
                    key={index}
                    draggableId={`${index}`}
                    index={index}
                    isDragDisabled={canEdit ? fixedindexs.includes(index) : true}
                  >
                    {(provided) => (
                      <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <TemplateList
                          processPlan={ProcessPlan}
                          setData={setData}
                          fixedindexs={fixedindexs}
                          updateFixedindex={updateFixedindex}
                          months={months}
                          degree={degree}
                          canEdit={canEdit}
                          index={index}
                        />
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        {canEdit && <AddList />}
      </div>
    </div>
  );
}
const TemplateList = ({
  processPlan,
  setData,
  fixedindexs,
  updateFixedindex,
  degree,
  months,
  index,
  canEdit,
}: ITemplateList) => {
  const [loading, setLoading] = useState<boolean>(true);
  const handleRect = useCallback((element: HTMLLIElement | null) => {
    if (element === null) return;
    setLoading(false);
  }, []);

  return (
    <>
      <div className="transition-colors hover:bg-muted/50 bg-white" key={index}>
        <div className="flex py-4 align-middle border-t border-t-1 border-[#eeee]">
          <div className="w-[500px] flex gap-3">
            <p>{`${index + 1}.`}</p>
            {fixedindexs.includes(index) ? (
              <p className="max-w-[500px]">{processPlan.step}</p>
            ) : (
              <>
                {canEdit ? (
                  <>
                    <Input
                      className="text-formal max-w-[500px]"
                      value={processPlan.step}
                      onChange={(element) => {
                        setData((prevList) =>
                          prevList!.map((item, idx) => (idx === index ? { ...item, step: element.target.value } : item))
                        );
                      }}
                    />
                    <GoPlus
                      className="self-center rotate-45"
                      size={30}
                      onClick={() => {
                        setData((prevList) => {
                          const newList = prevList!.filter((_, idx) => idx !== index);
                          updateFixedindex(newList);
                          return newList;
                        });
                      }}
                    />
                  </>
                ) : (
                  <p className="max-w-[500px]">{processPlan.step}</p>
                )}
              </>
            )}
          </div>
          <ul className="flex">
            {loading && <SkeletonList length={12} />}
            {Array.from({ length: degree === "Master" ? months : months / 3 }).map((_, indexChackBox) => (
              <li ref={handleRect} key={indexChackBox} className="w-20 flex justify-center items-center">
                {!fixedindexs.filter((item) => item !== 0).includes(index) ? (
                  <Input
                    key={indexChackBox}
                    type="checkbox"
                    className="w-12 h-4 accent-[#a67436]"
                    checked={Boolean(processPlan.months[indexChackBox])}
                    onChange={() => {
                      setData((prevList) => {
                        const newList = prevList!.map((item, idx) => {
                          if (idx === index) {
                            const newMonths = item.months.map((m, monthIdx) =>
                              monthIdx === indexChackBox ? Number(!m) : m
                            );
                            return { ...item, months: newMonths };
                          }
                          return item;
                        });
                        return newList;
                      });
                    }}
                  />
                ) : (
                  <Input
                    type="number"
                    className="w-14 text-center h-10 accent-[#a67436] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    value={processPlan.months[indexChackBox] == 0 ? "" : processPlan.months[indexChackBox]}
                    onChange={(element) => {
                      setData((prevList) => {
                        const newList = prevList!.map((item, idx) => {
                          if (idx === index) {
                            const newMonths = item.months.map((persen, monthIdx) =>
                              monthIdx === indexChackBox ? Number(element.target.value) : persen
                            );
                            return { ...item, months: newMonths };
                          }
                          return item;
                        });
                        return newList;
                      });
                    }}
                  />
                )}
              </li>
            ))}
          </ul>
          {(canEdit ? !fixedindexs.includes(index) : !true) && <GoGrabber className="self-center" size={30} />}
        </div>
      </div>
    </>
  );
};

const SkeletonList = ({ length }: { length: number }) => {
  return (
    <div className=" inline-flex gap-3">
      <section className=" flex gap-4">
        {Array.from({ length: length }).map((_, key) => (
          <Skeleton className="w-16 h-10" key={key} />
        ))}
      </section>
    </div>
  );
};

import React from "react";
import FlickeringGrid from "../ui/flickering-grid";

async function background({
  children,
}: Readonly<{
  children?: React.ReactNode;
}>) {
  return (
    // <div className="flex w-full h-full bg-white relative overflow-hidden justify-center items-center blur-lg z-0">
    // 	<div className="absolute w-[741px] h-[752px] top-[-113px] left-[-409px] bg-[#F26522] rounded-full inline-block"></div>
    // 	<div className="absolute w-[470px] h-[752px] left-full bg-[#F26522] rounded-full rotate-[-127deg]"></div>
    // </div>

    // <div className="flex w-full h-full fixed overflow-hidden justify-center items-center blur-lg z-0">
    //   <div className="absolute 2xl:w-[350px] 2xl:h-[750px] md:w-[350px] md:h-[350px] md:block hidden  -right-96 top-[250px] rounded-full blur-[250px] bg-[#F26522]" />
    //   <div className="absolute 2xl:w-[750px] 2xl:h-[750px] md:w-[700px] md:h-[700px] md:block hidden  -left-[700px] -top-[350px] rounded-full blur-[250px] bg-[#F26522] " />
    //   <div className="absolute 2xl:w-[400px] 2xl:h-[200px] 2xl:block hidden  -left-[200px] bottom-0 rounded-full blur-[200px] bg-[#F26522] rotate-2" />
    // </div>

    // <div className="w-full h-full bg-amber-500/60"></div>
    <div className="   flex relative h-full min-h-fit  w-full  flex-col items-center justify-start overflow-hidden lg:min-h-screen ">
      <div className="-z-10 to-[hsla(202, 36%, 96%, 1)] absolute -top-0 inset-0  h-[400px] w-full  bg-gradient-to-b from-[#f7eae4] lg:h-[550px] " />
      <FlickeringGrid
        className="-z-10 w-screen h-48 absolute inset-x-0 bottom-0  [mask-image:linear-gradient(to_top,white,transparent,transparent)] "
        squareSize={4}
        gridGap={6}
        color="hsl(24.6, 95%, 53.1%)"
        maxOpacity={0.5}
        flickerChance={0.1}
        height={300}
      />
      {children}
    </div>
  );
}

export default background;

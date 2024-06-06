import Background from "@/components/background/background";

const AuthLayout = ({children}: {children : React.ReactNode}) => {
    return ( 
        <>
        <Background/>
        <div className="h-full w-full flex absolute top-0 items-center justify-center">
            {children}
        </div>
        </>
        
    );
}
export default AuthLayout;
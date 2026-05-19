import { TailSpin } from "react-loader-spinner";


export default function Loading({
    size = 40,
    color = "#259073",
    fullScreen = false,
}) {
    return (
        <div className={`flex items-center justify-center w-full`}>
            <TailSpin
                height={size}
                width={size}
                color={color}
                ariaLabel="loading"
            />
        </div>
    );
}

import { useSearchParams } from "react-router-dom"


export default function Reader(){
    const [searchParams] = useSearchParams()

    return (
        <>
            <p>reader page</p>
            <p>src: {searchParams.get('src')}</p>
        </>
    )
}
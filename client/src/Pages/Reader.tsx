import { useSearchParams } from "react-router-dom"
import { Fetcher } from "swr"
import useSWR from 'swr'

const imageFetcher: Fetcher<string> = (requestUrl: string) => fetch(`http://localhost:3000/api/image?src=${requestUrl}`, {
}).then(res => {
        console.log(res)
        return res.blob()
    }).
    then(blob => {
        console.log(blob)
        return window.URL.createObjectURL(blob)
    })

export default function Reader(){
    const [searchParams] = useSearchParams()
    const srcUrl = searchParams.get('src') ?? ''

    const { data, error, isLoading } = useSWR(srcUrl, imageFetcher)

    if (error) {
        console.log(error)
        return <div>failed to load</div>
    }
    if (isLoading) return <div>loading...</div>

    return (
        <>
            <p>reader page</p>
            <p>src: {srcUrl}</p>
            <img src={data} />
        </>
    )
}
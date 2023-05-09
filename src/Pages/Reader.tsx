import { useSearchParams } from "react-router-dom"
import { Fetcher } from "swr"
import useSWR from 'swr'

const imageFetcher: Fetcher<string> = (requestUrl: string) => fetch(requestUrl, {mode: 'no-cors', method: "GET"}).then(res => {
    console.log(res)
    return res.blob()
}).then(blob => {
    console.log(blob)
    return window.URL.createObjectURL(blob)
})

export default function Reader(){
    const [searchParams] = useSearchParams()
    const srcUrl = searchParams.get('src') ?? ''

    const { data, error, isLoading } = useSWR(srcUrl, imageFetcher)

    if (error) return <div>failed to load</div>
    if (isLoading) return <div>loading...</div>

    return (
        <>
            <p>reader page</p>
            <p>src: {searchParams.get('src')}</p>
            <img src={data} />
        </>
    )
}
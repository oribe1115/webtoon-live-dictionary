import axios from "axios"
import { useSearchParams } from "react-router-dom"
import { Fetcher } from "swr"
import useSWR from 'swr'

// const imageFetcher: Fetcher<string> = (requestUrl: string) => fetch(requestUrl, ).then(res => {
//         console.log(res)
//         return res.blob()
//     }).
//     then(blob => {
//         console.log(blob)
//         return window.URL.createObjectURL(blob)
//     })

const imageFetcher: Fetcher<string> = (requestUrl: string) => axios.create({
    headers: {
        'Access-Control-Allow-Origin': '*'
    }
}).get(requestUrl).then(res => {
    console.log(res.data)
    return window.URL.createObjectURL(res.data)
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
            <p>src: {srcUrl}</p>
            <img src={data} />
        </>
    )
}
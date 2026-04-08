
import MoviePage from "./MoviePage";
type Props = {
    params: Promise<{ id: string }>
}

export default async function page({ params }: Props) {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    return (
        <>

            <MoviePage id={`${String(id)}`}></MoviePage>



        </>
    )
}
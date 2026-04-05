import NavBar from "@/components/Navbar/Navbar"


type Props = {
    children: React.ReactNode
}

export default function PagesLayout({ children }: Props) {



    return (
        <>

            <NavBar></NavBar>
            {children}

        </>
    )
}
import { useCallback, useEffect, useState } from "react";
import API, { socket } from "../axios/url";
import { useNavigate } from "react-router-dom";




export default function Products() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [hasMore, setHasMore] = useState(false)
    const [hasPrevious, setHasPrevious] = useState(false)
    const [pageNumbers, setPageNumbers] = useState([])
    const [error, setError] = useState(null)
    const limit = 50
    const navigate = useNavigate()

    useEffect(() => {
        console.log("products length", products.length)
        console.log("products length", products[0])
        console.log("products length", products[1])
    }, [products])


    useEffect(() => {
        const handleConnect = () => {
            socket.emit("join-module", "products")
        }

        socket.on("connect", handleConnect)

        if (socket.connected) {
            handleConnect()
        }

        return () => {
            socket.off("connect", handleConnect)
        }
    }, [])

    useEffect(() => {
        const handleDelete = (id) => {
            console.log("product-deleted", id)
            setProducts(prev =>
                prev.filter(product => product.id !== Number(id))
            )
        }

        const handleUpdate = ({ id, name, price, stock }) => {
            console.log("product-updated", id)
            setProducts(prev =>
                prev.map(product => product.id === Number(id) ? { ...product, name, price, stock, updated_at: new Date() } : product)
            )
        }

        const handleCreate = ({ id, name, price, stock }) => {
            console.log("product-created", id)
            id = Number(id)
            price = Number(price).toFixed(2)
            stock = Number(stock)
            console.log(id, name, price, stock)
            setProducts(prev => [...prev, prev.unshift({ id, name, price, stock })])
        }

        socket.on("product:deleted", handleDelete)
        socket.on("product:updated", handleUpdate)
        socket.on("product:created", handleCreate)

        return () => {
            socket.off("product:deleted", handleDelete)
            socket.off("product:updated", handleUpdate)
            socket.off("product:created", handleCreate)
        }
    }, [])

    useEffect(() => {
        setHasPrevious(page > 1)
        setHasMore(total > page * limit)
    }, [page, total])

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await API.get("/products",
                    {
                        params: {
                            page,
                            limit
                        }
                    }
                )
                const sortedProducts = [...data.products].sort((a, b) => b.id - a.id)
                setProducts(sortedProducts)
                setTotal(data.total)
            } catch (e) {
                console.error(e.response.data)
            }
        }
        fetchProducts()
    }, [page])

    const handleLoadMore = () => {
        if (!hasMore) return
        const nextPage = page + 1;
        setPage(nextPage)
    }

    const handleLoadPrevious = () => {
        if (!hasPrevious) return
        const prevPage = page - 1;
        setPage(prevPage)
    }

    const handleLoadPage = (pageNumber) => {
        setPage(pageNumber)
    }

    useEffect(() => {
        const generatePageNumbers = () => {
            const pages = []
            for (let i = page; i <= page + 5; i++) {
                pages.push(i)
            }
            setPageNumbers(pages)
        }
        generatePageNumbers()
    }, [page])

    const handleEdit = (id) => {
        console.log("edit", id)
        navigate(`/update-product/${id}`)
    }

    const handleDelete = async (id) => {
        try {
            const { data } = await API.delete(`/products/${id}`)
            console.log(data)
            if (data.ok) {
                socket.emit("delete-product", data.id)
                setProducts(products.filter((product) => product.id !== id))
            }
        } catch (e) {
            console.error(e.response.data)
        }
    }

    return (
        <div className='flex flex-col justify-center items-center w-full h-full'>
            <h1 className='text-3xl font-bold underline mb-15 mt-10'>Products</h1>
            <main className="mb-15">
                <div className="flex justify-end mr-10 mb-10">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer" onClick={() => navigate("/create-product")}>Crear producto</button>
                </div>
                <div className="flex flex-wrap gap-2 overflow-y-auto h-full justify-center">
                    {
                        products.map((product) => (
                            <div className="flex whitespace-nowrap overflow-hidden flex-col gap-2 border border-gray-200 rounded-lg p-4 bg-gray-800/5 shadow-md hover:bg-gray-800/15 hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer"
                                key={product.id}>
                                <p>{product.name}</p>
                                <p>{product.price}</p>
                                <div className="flex gap-2">
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer" onClick={() => handleEdit(product.id)}>Editar</button>
                                    <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded cursor-pointer" onClick={() => handleDelete(product.id)}>Eliminar</button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </main>
            <section className="flex-1 flex justify-center items-center gap-2">
                {hasPrevious && <button onClick={handleLoadPrevious} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer">Pagina anterior</button>}
                {page !== 1 && <button onClick={() => handleLoadPage(1)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer">1</button>}
                <div className="flex gap-1">
                    {pageNumbers.map((pageNumber) => (
                        <button key={pageNumber} onClick={() => handleLoadPage(pageNumber)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer">{pageNumber}</button>
                    ))}
                </div>
                {hasMore && <button onClick={handleLoadMore} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer">Siguiente pagina</button>}
            </section>
        </div>
    )
}
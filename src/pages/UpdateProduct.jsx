import { useEffect, useState } from "react"
import { useParams, useLocation } from "react-router-dom"
import API, { socket } from "../axios/url"

export default function UpdateProduct() {

    const { id } = useParams()
    const isEditMode = Boolean(id)
    const location = useLocation()
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [stock, setStock] = useState("")
    const [loading, setLoading] = useState(isEditMode)

    // useEffect(() => {
    //     console.log(name)
    //     console.log(price)
    //     console.log(stock)
    //     console.log(isEditMode)
    // }, [name, price, stock, isEditMode])

    useEffect(() => {
        const isUpdate = async () => {
            if (isEditMode) {
                console.log("update", id)
                try {
                    const { data } = await API.get(`/products/${id}`)
                    setName(data.product.name || "")
                    setPrice(data.product.price || "")
                    setStock(data.product.stock || "")
                } catch (e) {
                    console.error(e.response.data)
                } finally {
                    setLoading(false)
                }
            }
        }
        isUpdate()
    }, [id])

    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            const { data } = await API.put(`/products/${id}`, {
                name: name,
                price: price,
                stock: stock
            })
            console.log(data.ok)
            if (data.ok) {
                socket.emit("update-product", {
                    id: id,
                    name: name,
                    price: price,
                    stock: stock
                })
            }
        } catch (e) {
            console.error(e)
        }
    }

    const handleCreate = async (e) => {
        e.preventDefault()
        try {
            const { data } = await API.post(`/products`, {
                name: name,
                price: price,
                stock: stock
            })
            console.log(data)
            if (data.ok) {
                socket.emit("create-product", {
                    id: data.product.id,
                    name: data.product.name,
                    price: data.product.price,
                    stock: data.product.stock
                })
            }
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold mb-4">{isEditMode ? "Update Product" : "Create Product"}</h1>
            <form className="flex flex-col gap-4" onSubmit={isEditMode ? handleUpdate : handleCreate}>
                <label htmlFor="name">Name</label>
                <input type="text" placeholder="Name" className="border border-gray-300 rounded-md p-2" value={name} onChange={(e) => setName(e.target.value)} />
                <label htmlFor="price">Price</label>
                <input type="number" placeholder="Price" className="border border-gray-300 rounded-md p-2" value={price} onChange={(e) => setPrice(e.target.value)} />
                <label htmlFor="stock">Stock</label>
                <input type="number" placeholder="Stock" className="border border-gray-300 rounded-md p-2" value={stock} onChange={(e) => setStock(e.target.value)} />
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer">{isEditMode ? "Update" : "Create"}</button>
            </form>
        </div>
    )
}
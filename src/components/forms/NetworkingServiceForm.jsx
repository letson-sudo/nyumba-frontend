// 'use client'

// import { useState } from 'react'
// import axios from '@/lib/axios'
// import Label from '@/components/Label'
// import { Input } from '@/components/ui/input'
// import InputError from '@/components/InputError'
// import { Textarea } from '@/components/ui/textarea'
// import { Button } from '@/components/ui/button'

// const NetworkingServiceForm = () => {
//     const [form, setForm] = useState({
//         full_name: '',
//         service_title: '',
//         service_type: '',
//         experience: '',
//         location: '',
//         price_range: '',
//         phone_number: '',
//         email: '',
//         description: '',
//     })

//     const [errors, setErrors] = useState({})

//     const handleChange = e => {
//         setForm({ ...form, [e.target.name]: e.target.value })
//     }

//     const submitForm = async e => {
//         e.preventDefault()

//         try {
//             await axios.post('/api/networking-services', form)
//             alert('Service submitted successfully')
//             setErrors({})
//         } catch (error) {
//             if (error.response?.status === 422) {
//                 setErrors(error.response.data.errors)
//             } else {
//                 alert('An error occurred.')
//             }
//         }
//     }

//     return (
//         <div className=" bg-gray-100 flex items-center justify-center ">
//             <div className="w-full max-w-4xl bg-black/70 px-4">
                

//                 <form onSubmit={submitForm} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Column 1 */}
//                     <div>
//                         <Label htmlFor="full_name" className="text-white text-sm">Full Name</Label>
//                         <Input
//                             id="full_name"
//                             name="full_name"
//                             type="text"
//                             value={form.full_name}
//                             onChange={handleChange}
//                             required
//                             className=" w-full bg-blue-100 text-black border border-black/70"
//                         />
//                         <InputError messages={errors.full_name} className="text-red-500 text-sm mt-1" />
//                     </div>

//                     <div>
//                         <Label htmlFor="phone_number" className="text-white text-sm">Phone Number</Label>
//                         <Input
//                             id="phone_number"
//                             name="phone_number"
//                             type="text"
//                             value={form.phone_number}
//                             onChange={handleChange}
//                             required
//                             className=" w-full bg-blue-100 text-black border border-black/70"
//                         />
//                         <InputError messages={errors.phone_number} className="text-red-500 text-sm mt-1" />
//                     </div>

//                     <div>
//                         <Label htmlFor="service_title" className="text-white text-sm">Service Title</Label>
//                         <Input
//                             id="service_title"
//                             name="service_title"
//                             type="text"
//                             value={form.service_title}
//                             onChange={handleChange}
//                             required
//                             className="w-full bg-blue-100 text-black border border-black/70"
//                         />
//                         <InputError messages={errors.service_title} className="text-red-500 text-sm mt-1" />
//                     </div>

//                     <div>
//                         <Label htmlFor="service_type" className="text-white">Service Type</Label>
//                         <Input
//                             id="service_type"
//                             name="service_type"
//                             type="text"
//                             value={form.service_type}
//                             onChange={handleChange}
//                             required
//                             className="mt-1 w-full bg-blue-100 text-black border border-black/70"
//                         />
//                         <InputError messages={errors.service_type} className="text-red-500 text-sm mt-1" />
//                     </div>

//                     <div>
//                         <Label htmlFor="location" className="text-white">Location</Label>
//                         <Input
//                             id="location"
//                             name="location"
//                             type="text"
//                             value={form.location}
//                             onChange={handleChange}
//                             required
//                             className="mt-1 w-full bg-blue-100 text-black border border-black/70"
//                         />
//                         <InputError messages={errors.location} className="text-red-500 text-sm mt-1" />
//                     </div>

//                     <div>
//                         <Label htmlFor="price_range" className="text-white">Price Range</Label>
//                         <Input
//                             id="price_range"
//                             name="price_range"
//                             type="text"
//                             value={form.price_range}
//                             onChange={handleChange}
//                             required
//                             className="mt-1 w-full bg-blue-100 text-black border border-black/70"
//                         />
//                         <InputError messages={errors.price_range} className="text-red-500 text-sm mt-1" />
//                     </div>

//                     <div>
//                         <Label htmlFor="experience" className="text-white">Experience (optional)</Label>
//                         <Input
//                             id="experience"
//                             name="experience"
//                             type="text"
//                             value={form.experience}
//                             onChange={handleChange}
//                             className="mt-1 w-full bg-blue-100 text-black border border-black/70"
//                         />
//                         <InputError messages={errors.experience} className="text-red-500 text-sm mt-1" />
//                     </div>

//                     <div>
//                         <Label htmlFor="email" className="text-white">Email (optional)</Label>
//                         <Input
//                             id="email"
//                             name="email"
//                             type="email"
//                             value={form.email}
//                             onChange={handleChange}
//                             className="mt-1 w-full bg-blue-100 text-black border border-black/70"
//                         />
//                         <InputError messages={errors.email} className="text-red-500 text-sm mt-1" />
//                     </div>

//                     {/* Full Width - Description */}
//                     <div className="md:col-span-2">
//                         {/* <Label htmlFor="description" className="text-white">Description (optional)</Label> */}
//                         <Textarea
//                             id="description"
//                             name="description"
//                             type="text"
//                             placeholdr="description"
//                             value={form.description}
//                             onChange={handleChange}
//                             className="mt-1 w-full bg-blue-100 text-black border border-black/70"
//                         />
//                         <InputError messages={errors.description} className="text-red-500 text-sm mt-1" />
//                     </div>

//                     {/* Submit Button - full width */}
//                     <div className="md:col-span-2 flex justify-center ">
//                         <Button className="  text-black font-bold py-2 rounded-xl shadow hover:brightness-110 mb-5">
//                             Submit
//                         </Button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     )
// }

// export default NetworkingServiceForm


'use client'

import { useState } from 'react'
import axios from '@/lib/axios'
import { Input } from '@/components/ui/input'
import InputError from '@/components/InputError'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const NetworkingServiceForm = () => {
    const [form, setForm] = useState({
        full_name: '',
        service_title: '',
        service_type: '',
        experience: '',
        location: '',
        price_range: '',
        phone_number: '',
        email: '',
        description: '',
    })

    const [errors, setErrors] = useState({})

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const submitForm = async e => {
        e.preventDefault()

        try {
            await axios.post('/api/networking-services', form)
            alert('Service submitted successfully')
            setErrors({})
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors)
            } else {
                alert('An error occurred.')
            }
        }
    }

    return (
        <div className="bg-gray-100 flex items-center justify-center">
            <div className="w-full max-w-4xl bg-black/70 px-4">
                <form onSubmit={submitForm} className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                    <Input
                        id="full_name"
                        name="full_name"
                        type="text"
                        placeholder="Full Name"
                        value={form.full_name}
                        onChange={handleChange}
                        required
                        className="w-full bg-blue-100 text-black border border-black/70"
                    />
                    <InputError messages={errors.full_name} className="text-red-500 text-sm mt-1" />

                    <Input
                        id="phone_number"
                        name="phone_number"
                        type="text"
                        placeholder="Phone Number"
                        value={form.phone_number}
                        onChange={handleChange}
                        required
                        className="w-full bg-blue-100 text-black border border-black/70"
                    />
                    <InputError messages={errors.phone_number} className="text-red-500 text-sm mt-1" />

                    <Input
                        id="service_title"
                        name="service_title"
                        type="text"
                        placeholder="Service Title"
                        value={form.service_title}
                        onChange={handleChange}
                        required
                        className="w-full bg-blue-100 text-black border border-black/70"
                    />
                    <InputError messages={errors.service_title} className="text-red-500 text-sm mt-1" />

                    <Input
                        id="service_type"
                        name="service_type"
                        type="text"
                        placeholder="Service Type"
                        value={form.service_type}
                        onChange={handleChange}
                        required
                        className="w-full bg-blue-100 text-black border border-black/70"
                    />
                    <InputError messages={errors.service_type} className="text-red-500 text-sm mt-1" />

                    <Input
                        id="location"
                        name="location"
                        type="text"
                        placeholder="Location"
                        value={form.location}
                        onChange={handleChange}
                        required
                        className="w-full bg-blue-100 text-black border border-black/70"
                    />
                    <InputError messages={errors.location} className="text-red-500 text-sm mt-1" />

                    <Input
                        id="price_range"
                        name="price_range"
                        type="text"
                        placeholder="Price Range"
                        value={form.price_range}
                        onChange={handleChange}
                        required
                        className="w-full bg-blue-100 text-black border border-black/70"
                    />
                    <InputError messages={errors.price_range} className="text-red-500 text-sm mt-1" />

                    <Input
                        id="experience"
                        name="experience"
                        type="text"
                        placeholder="Experience (optional)"
                        value={form.experience}
                        onChange={handleChange}
                        className="w-full bg-blue-100 text-black border border-black/70"
                    />
                    <InputError messages={errors.experience} className="text-red-500 text-sm mt-1" />

                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Email (optional)"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full bg-blue-100 text-black border border-black/70"
                    />
                    <InputError messages={errors.email} className="text-red-500 text-sm mt-1" />

                    <div className="md:col-span-2">
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Description (optional)"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full bg-blue-100 text-black border border-black/70"
                        />
                        <InputError messages={errors.description} className="text-red-500 text-sm mt-1" />
                    </div>

                    <div className="md:col-span-2 flex justify-center">
                        <Button className="text-black font-bold py-2 rounded-xl shadow hover:brightness-110 mb-5">
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </div>
        
    )
}

export default NetworkingServiceForm

'use client'

import { useState } from 'react'
import axios from '@/lib/axios'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import InputError from '@/components/InputError'
import { Button } from '@/components/ui/button'

const SoftwareDevelopmentServiceForm = () => {
    const [form, setForm] = useState({
        full_name: '',
        service_title: '',
        software_type: '',
        skills: '',
        experience: '',
        location: '',
        price: '',
        phone_number: '',
        email: '',
        portfolio: '',
        maintenance_details: '',
        description: '',
    })

    const [errors, setErrors] = useState({})

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const submitForm = async e => {
        e.preventDefault()

        try {
            await axios.post('/api/software-development', form)
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
                        name="full_name"
                        placeholder="Full Name"
                        value={form.full_name}
                        onChange={handleChange}
                        required
                        className="bg-blue-100 text-black border border-black/70"
                    />
                    <InputError messages={errors.full_name} className="text-red-500 text-sm mt-1" />

                    <Input
                        name="phone_number"
                        placeholder="Phone Number"
                        value={form.phone_number}
                        onChange={handleChange}
                        required
                        className="bg-blue-100 text-black border border-black/70"
                    />
                    <InputError messages={errors.phone_number} className="text-red-500 text-sm mt-1" />

                    <Input
                        name="service_title"
                        placeholder="Service Title"
                        value={form.service_title}
                        onChange={handleChange}
                        required
                        className="bg-blue-100 text-black border border-black/70"
                    />
                    <InputError messages={errors.service_title} className="text-red-500 text-sm mt-1" />

                    <Input
                        name="software_type"
                        placeholder="Software Type"
                        value={form.software_type}
                        onChange={handleChange}
                        required
                        className="bg-blue-100 text-black border border-black/70"
                    />
                    <InputError messages={errors.software_type} className="text-red-500 text-sm mt-1" />

                    <Input
                        name="skills"
                        placeholder="Skills"
                        value={form.skills}
                        onChange={handleChange}
                        required
                        className="bg-blue-100 text-black border border-black/70"
                    />
                    <InputError messages={errors.skills} className="text-red-500 text-sm mt-1" />

                    <Input
                        name="location"
                        placeholder="Location"
                        value={form.location}
                        onChange={handleChange}
                        required
                        className="bg-blue-100 text-black border border-black/70"
                    />
                    <InputError messages={errors.location} className="text-red-500 text-sm mt-1" />

                    <Input
                        name="price"
                        placeholder="Price"
                        value={form.price}
                        onChange={handleChange}
                        required
                        className="bg-blue-100 text-black border border-black/70"
                    />
                    <InputError messages={errors.price} className="text-red-500 text-sm mt-1" />

                    <Input
                        name="experience"
                        placeholder="Experience (optional)"
                        value={form.experience}
                        onChange={handleChange}
                        className="bg-blue-100 text-black border border-black/70"
                    />
                    <InputError messages={errors.experience} className="text-red-500 text-sm mt-1" />

                    <Input
                        name="email"
                        type="email"
                        placeholder="Email (optional)"
                        value={form.email}
                        onChange={handleChange}
                        className="bg-blue-100 text-black border border-black/70"
                    />
                    <InputError messages={errors.email} className="text-red-500 text-sm mt-1" />

                    <Input
                        name="portfolio"
                        placeholder="Portfolio (optional)"
                        value={form.portfolio}
                        onChange={handleChange}
                        className="bg-blue-100 text-black border border-black/70"
                    />
                    <InputError messages={errors.portfolio} className="text-red-500 text-sm mt-1" />

                    <Input
                        name="maintenance_details"
                        placeholder="Maintenance Details (optional)"
                        value={form.maintenance_details}
                        onChange={handleChange}
                        className="bg-blue-100 text-black border border-black/70"
                    />
                    <InputError messages={errors.maintenance_details} className="text-red-500 text-sm mt-1" />

                    <div className="md:col-span-2">
                        <Textarea
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

export default SoftwareDevelopmentServiceForm

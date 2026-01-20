import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
// import { useAuth0 } from "@auth0/auth0-react";
import { Registration, getinfo } from './Redux/actions';
import Modal from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Upload, Loader2, X } from 'lucide-react';

const NewGrievanceModal = ({ isOpen, onClose }) => {
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
    const dispatch = useDispatch();
    // const { user } = useAuth0();
    const user = { name: "Test User", sub: "mock-id-123" };

    const [location, setLocation] = useState(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const onSubmit = (data) => {
        const payload = {
            ...data,
            userId: user.sub,
            createdBy: user.name || user.email,
            status: "In progress",
            location: location,
            image: imagePreview
        };
        // dispatch(Registration(payload));
        console.log("Submitting Grievance:", payload);
        reset();
        setLocation(null);
        setImagePreview(null);
        onClose();
    };

    const handleGetLocation = () => {
        setIsLoadingLocation(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const { latitude, longitude } = position.coords;
                setLocation({ lat: latitude, lng: longitude });
                setIsLoadingLocation(false);
            }, function (error) {
                console.error("Error getting location:", error);
                setIsLoadingLocation(false);
                alert("Could not get your location. Please allow permissions.");
            });
        } else {
            setIsLoadingLocation(false);
            alert("Geolocation is not supported by your browser.");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        setValue("image", null);
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="File a New Grievance" maxWidth="max-w-2xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Name</label>
                        <Input
                            {...register("name", { required: true })}
                            placeholder="e.g. John Doe"
                            className="bg-gray-50 focus:bg-white transition-colors"
                        />
                        {errors.name && <span className="text-xs text-red-500 font-medium">This field is required</span>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                        <Input
                            {...register("phoneno", { required: true })}
                            placeholder="+91 98765 43210"
                            className="bg-gray-50 focus:bg-white transition-colors"
                        />
                        {errors.phoneno && <span className="text-xs text-red-500 font-medium">This field is required</span>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Ward No</label>
                        <Input
                            type="number"
                            {...register("wardno", { required: true })}
                            placeholder="e.g. 12"
                            className="bg-gray-50 focus:bg-white transition-colors"
                        />
                        {errors.wardno && <span className="text-xs text-red-500 font-medium">This field is required</span>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Department</label>
                        <Input
                            {...register("department", { required: true })}
                            placeholder="e.g. Sanitation, Roads, Electricity"
                            className="bg-gray-50 focus:bg-white transition-colors"
                        />
                        {errors.department && <span className="text-xs text-red-500 font-medium">This field is required</span>}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Grievance Subject</label>
                    <Input
                        {...register("subject", { required: true })}
                        placeholder="Brief title for your issue"
                        className="bg-gray-50 focus:bg-white transition-colors font-medium"
                    />
                    {errors.subject && <span className="text-xs text-red-500 font-medium">This field is required</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Location / Address</label>
                        <Input
                            {...register("address", { required: true })}
                            placeholder="Detailed address of the issue"
                            className="bg-gray-50 focus:bg-white transition-colors"
                        />
                        {errors.address && <span className="text-xs text-red-500 font-medium">This field is required</span>}
                        <input type="hidden" value="default" {...register("arealimit")} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">GPS Coordinates</label>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full border-dashed border-gray-400 text-gray-600 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50"
                                onClick={handleGetLocation}
                                disabled={isLoadingLocation}
                            >
                                {isLoadingLocation ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <MapPin className="w-4 h-4 mr-2" />}
                                {location ? "Update Location" : "Get My Location"}
                            </Button>
                        </div>
                        {location && (
                            <p className="text-xs text-green-600 font-medium mt-1">
                                Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
                            </p>
                        )}
                    </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Attach Evidence</label>
                    {!imagePreview ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-blue-400 transition-all cursor-pointer relative">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleImageChange}
                            />
                            <Upload className="w-8 h-8 mb-2 text-gray-400" />
                            <p className="text-sm font-medium">Click to upload image</p>
                            <p className="text-xs text-gray-400">JPG, PNG, GIF up to 5MB</p>
                        </div>
                    ) : (
                        <div className="relative group rounded-xl overflow-hidden border border-gray-200 w-full h-48 bg-gray-100 flex items-center justify-center">
                            <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={removeImage}
                                >
                                    <X className="w-4 h-4 mr-2" /> Remove
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Detailed Description</label>
                    <Textarea
                        {...register("description", { required: true })}
                        placeholder="Describe the issue in detail. Include any relevant information that might help resolve it faster."
                        className="min-h-[120px] bg-gray-50 focus:bg-white transition-colors resize-y"
                    />
                    {errors.description && <span className="text-xs text-red-500 font-medium">This field is required</span>}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={onClose} className="border-gray-300">Cancel</Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">Submit Grievance</Button>
                </div>
            </form>
        </Modal>
    )
}

export default NewGrievanceModal

import React from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useAuth0 } from "@auth0/auth0-react";
import { Registration, getinfo } from './Redux/actions';
import Modal from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const NewGrievanceModal = ({ isOpen, onClose }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const dispatch = useDispatch();
    const { user } = useAuth0();

    const onSubmit = (data) => {
        const payload = {
            ...data,
            userId: user.sub,
            createdBy: user.name || user.email,
            status: "In progress" // explicit default
        };
        dispatch(Registration(payload));
        reset();
        onClose();
        // Optimistic refresh
        setTimeout(() => dispatch(getinfo(user.sub)), 500);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="File a New Grievance">
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input {...register("name", { required: true })} placeholder="Your Name" />
                        {errors.name && <span className="text-xs text-red-500">Required</span>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Phone No</label>
                        <Input {...register("phoneno", { required: true })} placeholder="Phone Number" />
                        {errors.phoneno && <span className="text-xs text-red-500">Required</span>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Ward No</label>
                        <Input type="number" {...register("wardno", { required: true })} placeholder="Ward No" />
                        {errors.wardno && <span className="text-xs text-red-500">Required</span>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Department</label>
                        <Input {...register("department", { required: true })} placeholder="e.g. Sanitation" />
                        {errors.department && <span className="text-xs text-red-500">Required</span>}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Input {...register("subject", { required: true })} placeholder="Brief summary of the issue" />
                    {errors.subject && <span className="text-xs text-red-500">Required</span>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Address / Area</label>
                    <Input {...register("address", { required: true })} placeholder="Location of the issue" />
                    {errors.address && <span className="text-xs text-red-500">Required</span>}
                    {/* Hidden fields for compatibility if needed, or mapped logic */}
                    <input type="hidden" value="default" {...register("arealimit")} />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                        {...register("description", { required: true })}
                        placeholder="Please describe the issue in detail..."
                        className="min-h-[100px]"
                    />
                    {errors.description && <span className="text-xs text-red-500">Required</span>}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Submit Grievance</Button>
                </div>
            </form>
        </Modal>
    )
}

export default NewGrievanceModal

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
    resultSchema,
    ResultSchema,
    subjectSchema,
    SubjectSchema,
} from "@/lib/formValidationSchemas";
import {
    createResult,
    createSubject,
    updateResult,
    updateSubject,
} from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ResultForm = ({
    type,
    data,
    setOpen,
    relatedData,
}: {
    type: "create" | "update";
    data?: any;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: any;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResultSchema>({
        resolver: zodResolver(resultSchema),
    });

    // AFTER REACT 19 IT'LL BE USEACTIONSTATE

    const [state, formAction] = useFormState(
        type === "create" ? createResult : updateResult,
        {
            success: false,
            error: false,
        }
    );

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        formAction(data);
    });

    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast(`Lesson has been ${type === "create" ? "created" : "updated"}!`);
            setOpen(false);
            router.refresh();
        }
    }, [state, router, type, setOpen]);

    const { exams, assignments, students } = relatedData;



    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a new lesson" : "Update the lesson"}
            </h1>

            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Score"
                    name="score"
                    defaultValue={data?.score}
                    register={register}
                    error={errors?.score}
                />
                {data && (
                    <InputField
                        label="Id"
                        name="id"
                        defaultValue={data?.id}
                        register={register}
                        error={errors?.id}
                        hidden
                    />
                )}


                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Exam</label>
                    <select
                        multiple
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("examId")}
                        defaultValue={data?.exams}
                        onChange={(e) => {
                            const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                            console.log("Selected teacher IDs:", selectedOptions);
                        }}
                    >
                        {exams.map(
                            (exam: { id: string; name: string; }) => (
                                <option value={exam.id} key={exam.id}>
                                    {exam.name}
                                </option>
                            )
                        )}
                    </select>
                    {errors.examId?.message && (
                        <p className="text-xs text-red-400">
                            {errors.examId.message.toString()}
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Student</label>
                    <select
                        multiple
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("studentId")}
                        defaultValue={data?.students?.map((student: { id: string }) => student.id)}
                        onChange={(e) => {
                            const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                            console.log("Selected teacher IDs:", selectedOptions);
                        }}
                    >
                        {students.map(
                            (student: { id: string; name: string; surname: string }) => (
                                <option value={student.id} key={student.id}>
                                    {student.name + " " + student.surname}
                                </option>
                            )
                        )}
                    </select>
                    {

                        errors.studentId?.message && (
                            <p className="text-xs text-red-400">
                                {errors.studentId.message.toString()}
                            </p>
                        )}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Assignment</label>
                    <select
                        multiple
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("assignmentId")}
                        defaultValue={data?.assignments}
                    >
                        {assignments.map(
                            (assignment: { id: string; name: string; }) => (
                                <option value={assignment.id} key={assignment.id}>
                                    {assignment.name}
                                </option>
                            )
                        )}
                    </select>
                    {errors.assignmentId?.message && (
                        <p className="text-xs text-red-400">
                            {errors.assignmentId.message.toString()}
                        </p>
                    )}
                </div>
            </div>
            {state.error && (
                <span className="text-red-500">Something went wrong!</span>
            )}
            <button className="bg-blue-400 text-white p-2 rounded-md">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default ResultForm;

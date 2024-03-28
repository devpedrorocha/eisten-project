'use client'
import z from 'zod'
import { useState } from "react"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdVerifiedUser } from "react-icons/md";
import { PiStudent } from "react-icons/pi";

const MAX_FILE_SIZE = 500000;
const ACCEPTED_FILE_TYPES = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];

type FormSchema = {
    correctAnswers: File[]
    studentAnswers: File[]
}

const FileSchema = z.object({
    correctAnswers: z
    .any()
    .refine((files) => files?.length == 1, "Arquivo de correção é necessário")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `O tamanho máximo é de 5MB.`)
    .refine(
        (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
        "Apenas .xlsx são permitidos."
    ),
    studentAnswers: z
        .any()
        .refine((files) => files?.length == 1, "Arquivo com respostas dos alunos necessário.")
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `O tamanho máximo é de 5MB.`)
        .refine(
        (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
        "Apenas .xlsx são permitidos."
        ),
});

export function InputFile(){
    
    
    const [correctFile, setCorrectFile] = useState('');
    const [studentFile, setStudentFile] = useState('');
    
    const {register, handleSubmit, formState: {errors}} = useForm<FormSchema>({
        resolver: zodResolver(FileSchema)
    });

    const handleSendFile = (file: FormSchema) => {

        const formData = new FormData()
        formData.append('correctFile',file.correctAnswers[0])
        formData.append('studentFile',file.studentAnswers[0])


        fetch("http://localhost:8007/upload",{
            method: 'POST',
            body: formData
        }).then(response => {
            return response.json();
        }).then(data => {
            console.log(data);
        }).catch(error => {
            console.error('Erro na requisição:', error);
        });
    }

    return (
        <form onSubmit={handleSubmit(handleSendFile)} className='flex flex-col gap-8 w-full'>
            <section className='flex flex-col gap-6'>
                <div>
                    <div className='flex items-center justify-center gap-4'>
                        <input type="file" id='correct-file' hidden className="" {...register('correctAnswers')}/>
                        <label className='border bg-[#286B9F] text-white h-10 w-1/4 text-center items-center rounded-md pt-2 cursor-pointer' htmlFor="correct-file">Importar Gabarito</label>


                        {correctFile ? (<p>{correctFile}</p>) : (<MdVerifiedUser  size={40} color="#286B9F" />)}
                    </div>
                    
                    {errors.correctAnswers ? <p className='text-red-500 text-center'>{errors.correctAnswers.message}</p> : null}
                </div>

                <div>
                    <div className='flex items-center justify-center gap-4'>

                        <input type="file" id='student-file' hidden className="" {...register('studentAnswers')}/>
                        <label className='border bg-[#286B9F] text-white h-10 w-1/4 text-center items-center rounded-md pt-2 cursor-pointer' htmlFor="student-file">Importar Simulados</label>

                        {studentFile ? (<p>{studentFile}</p>) : (<PiStudent size={40} color="#286B9F" />)}
                    </div>

                    {errors.studentAnswers ? <p className='text-red-500 text-center'>{errors.studentAnswers.message}</p> : null}
                </div>
            </section>


            <button className='border self-center rounded p-2 bg-[#286B9F] text-white w-1/3' type='submit'> Enviar arquivos</button>

        </form>
    )
}
import Fastify from 'fastify';
import multipart from '@fastify/multipart';
import cors from '@fastify/cors'
import xlsx from 'xlsx'
import fs from 'fs'

const fastify = Fastify({
  logger: true
});

fastify.register(multipart, { attachFieldsToBody: true });
fastify.register(cors)


fastify.get('/', () =>{
    return {'message': 'Hello world'}
})

fastify.post('/upload', async function (req, reply) {

  let totalQuestions = 0

  const data = await req.saveRequestFiles();
  if (data.length === 0) {
    return reply.code(400).send({ message: 'Erro no corpo da requisição' });
  }

  const correctFile = data.find(f => f.fieldname === 'correctFile');
  if (!correctFile) {
    return reply.code(400).send({ message: 'Arquivo "correctFile" não encontrado' });
  }

  const studentFile = data.find(f => f.fieldname === 'studentFile');
  if (!studentFile) {
    return reply.code(400).send({ message: 'Arquivo "studentFile" não encontrado' });
  }

  const preFormatFile = await parseFile(correctFile.filepath);
  const studentsAnswers = await parseFile(studentFile.filepath);
  
  const correctAnswersJSON = preFormatFile.map(row => ({
    question: row['Questão'], 
    correct_answer: row['Gabarito']
  }));
  
  totalQuestions = correctAnswersJSON.length;
  
  let studentsInformations = {}

  for (let i=0; i < studentsAnswers.length; i++){
    for(let j = 0; j < totalQuestions; j++){
      if(studentsAnswers[i]['resp_aluno'] !== null){
        if(correctAnswersJSON[j]['question'] == studentsAnswers[i]['num_exercicio']){
          if(correctAnswersJSON[j]['correct_answer'].toLowerCase() === studentsAnswers[i]['resp_aluno'].toLowerCase()){
            if(!studentsInformations[`${studentsAnswers[i]['aluno_nome']}`]){
              studentsInformations[`${studentsAnswers[i]['aluno_nome']}`] = {'successAnswers' : 0}
            }
            studentsInformations[`${studentsAnswers[i]['aluno_nome']}`]['successAnswers'] += 1
          }
        }
      }else {
        console.log('Não marcou questão');
      }
    }
  }
  console.log(studentsInformations, 'Resultado')
  
})

async function parseFile(filepath) {
  const buffer = await fs.promises.readFile(filepath);
  const workbook = xlsx.read(buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return xlsx.utils.sheet_to_json(sheet);
}

try {
  await fastify.listen({ port: 8007 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
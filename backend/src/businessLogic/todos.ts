import { TodosAccess } from '../accessLayer/todosAcess'
//import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import {TodoUpdate} from "../models/TodoUpdate";
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'

// TODO: Implement businessLogic
const s3BucketName = process.env.ATTACHMENT_S3_BUCKET
const todoAccess = new TodosAccess();

  export async function createAttachmentPresignedUrl(todoId: string): Promise<string>{
    return todoAccess.createAttachmentPresignedUrl(todoId)
  }

  export async function getAllTodo(userId: string): Promise<TodoItem[]> {
    return todoAccess.getAllTodo(userId);
  }

  export async function createTodo(CreateTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem>{
    const todoId = uuid.v4()
    
    return todoAccess.createTodo({
      userId: userId,
      todoId: todoId,
      attachmentUrl: `https://${s3BucketName}.s3.amazonaws.com/${todoId}`,
      createdAt: new Date().getTime().toString(),
      done: false,
      ...CreateTodoRequest
    })
    
  }

  export async function updateTodo(UpdateTodoRequest: UpdateTodoRequest,userId: string, todoId: string):Promise<TodoUpdate> {
    return todoAccess.updateTodo(UpdateTodoRequest,userId,todoId);
  }

  export async function deleteTodo(userId: string, todoId: string) : Promise<string> {
    return todoAccess.deleteTodo(userId, todoId);
  }

  
  

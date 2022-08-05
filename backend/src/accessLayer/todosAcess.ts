import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import { String } from 'aws-sdk/clients/appstream'

 const XAWS = AWSXRay.captureAWS(AWS)

 const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todoTable = process.env.TODOS_TABLE,
        private readonly s3BucketName = process.env.ATTACHMENT_S3_BUCKET,
        private readonly s3 = new XAWS.S3({signatureVersion: 'v4'}) 
        ){}

    async  createTodo(todo : TodoItem): Promise<TodoItem>{
        await this.docClient.put({
            TableName: this.todoTable,
            Item: todo
        }).promise()
        return todo as TodoItem
    }

    async  getAllTodo(userId : string): Promise<TodoItem[]>{

        
        const params = {
            TableName: this.todoTable,
            KeyConditionExpression: "#userId = :userId",
            ExpressionAttributeNames: {
                "#userId": "userId"
            },
            ExpressionAttributeValues: {
                ":userId": userId
            }
        };
        const result = await this.docClient.query(params).promise();

        const Item = result.Items
        return Item as TodoItem[]
    }

    async  updateTodo(todoUpdate: TodoUpdate ,todoId : string, userId: string): Promise<TodoUpdate>{
        const param = {
            TableName: this.todoTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
            UpdateExpression: "set #a = :a, #b = :b, #c = :c",
            ExpressionAttributeNames: {
                "#a": "name",
                "#b": "dueDate",
                "#c": "done"
            },
            ExpressionAttributeValues: {
                ":a": todoUpdate['name'],
                ":b": todoUpdate['dueDate'],
                ":c": todoUpdate['done']
            },
            ReturnValues: "ALL_NEW"
        };

        await this.docClient.update(param).promise()
        return
    }

    async deleteTodo(userId: String,todoId: string): Promise<string>{

        const params = {
            TableName: this.todoTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
        };
        await this.docClient.delete(params).promise()
        return
    }

    async  createAttachmentPresignedUrl(todoId: string): Promise<string>{

        const url =  this.s3.getSignedUrl('putObject', {
            Bucket: this.s3BucketName,
            Key: todoId,
            Expires: 600
          })

          logger.info("PresignedUrl string: "+ url)
          return url as string;
    }
    
}
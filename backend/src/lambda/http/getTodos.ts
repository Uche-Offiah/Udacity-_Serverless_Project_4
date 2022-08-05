import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { getAllTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils';

// TODO: Get all TODO items for a current user
const logger = createLogger('getTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const userId = getUserId(event)
    logger.info("User Id parsed for Todo"+ userId);

    const todos = await getAllTodo(userId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        "Items": todos
      })
    }
  })

handler.use(
  cors({
    credentials: true
  })
)

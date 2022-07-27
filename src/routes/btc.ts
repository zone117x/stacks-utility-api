import { Server } from 'http';
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyPluginCallback } from "fastify";
import { Type } from '@sinclair/typebox';
import { getAddressInfo } from '../util';

export const BtcRoutes: FastifyPluginCallback<
  Record<never, never>,
  Server,
  TypeBoxTypeProvider
> = async (fastify, options, done) => {
  fastify.get('/addr/:address', {
    schema: {
      params: Type.Object({
        address: Type.String({
          description: 'Specify either a Stacks or Bitcoin address',
          examples: ['SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', '1FzTxL9Mxnm2fdmnQEArfhzJHevwbvcH6d'],
        }),
      }),
      querystring: Type.Object({
        network: Type.Optional(Type.Union([Type.Literal('mainnet'), Type.Literal('testnet')], {
          description: 'Specify if the address should be converted to mainnet or testnet',
          examples: ['mainnet', 'testnet'],
        }))
      }),
    }
  }, (request, reply) => {
    const addrInfo = getAddressInfo(request.params.address, request.query.network);
    reply.type('application/json').send(addrInfo);
  });
}

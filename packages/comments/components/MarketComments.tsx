import { revalidateTag } from 'next/cache'
import React from 'react'
import { z } from 'zod'
import { Card } from '@play-money/ui/card'
import { MarketCommentSchema } from '../lib/getCommentsOnMarket'
import { CommentsList } from './CommentsList'

// TODO: @casesandberg Generate this from OpenAPI schema
async function getMarketComments({
  marketId,
}: {
  marketId: string
}): Promise<{ comments: Array<z.infer<typeof MarketCommentSchema>> }> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/markets/${marketId}/comments`, {
    credentials: 'include',
    next: { tags: ['comments'] },
  })
  return await response.json()
}

export async function MarketComments({ marketId }: { marketId: string }) {
  const { comments } = await getMarketComments({ marketId })

  const handleRevalidate = async () => {
    'use server'
    revalidateTag('comments')
  }

  return <CommentsList comments={comments} entity={{ type: 'MARKET', id: marketId }} onRevalidate={handleRevalidate} />
}

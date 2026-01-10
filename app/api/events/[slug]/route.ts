import connectDB from '@/lib/mongodb'
import { Event } from '@/database'
import { NextRequest, NextResponse } from 'next/server'

// define route params type for type-safety
type RouteParams = {
  params: Promise<{
    slug: string
  }>
}

/**
 * Get /api/events/[slug]
 * fetch single event
 */

export async function GET(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    await connectDB()

    const { slug } = await params

    //  validate slug parameter
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return NextResponse.json(
        { message: 'Invalid or missing slug parameter' },
        { status: 400 }
      )
    }

    // sanitize slug
    const sanitizedSlug = slug.trim().toLocaleLowerCase()

    // query event
    const event = await Event.findOne({ slug: sanitizedSlug }).lean()

    // handle event not found
    if (!event) {
      return NextResponse.json(
        { message: `Event with title '${slug}' not found` },
        { status: 404 }
      )
    }

    // Return successfull response with event data
    return NextResponse.json(
      { message: 'Event fetched Successfully', event },
      { status: 200 }
    )
  } catch (error) {
    // log error for debugging in development only
    if (process.env.NODE_ENV === 'development') {
      console.log('Error fetching event by slug', error)
    }

    // handle specific errors
    if (error instanceof Error) {
      // handle database error
      if (error.message.includes('MONGODB_URI')) {
        return NextResponse.json(
          { message: 'Database Configuration Error' },
          { status: 500 }
        )
      }

      // Return generic error with error message
      return NextResponse.json(
        {
          message: 'Failed to fetch event',
          error: error.message,
        },
        { status: 500 }
      )
    }

    // handle unknown error
    return NextResponse.json(
      { message: 'Unknown error occurred' },
      { status: 500 }
    )
  }
}

import { loadComponents } from 'next/dist/server/load-components'
import { notFound } from 'next/navigation'

const BASE_URl = process.env.NEXT_PUBLIC_BASE_URL

const EventDetailItem = ({
  icon,
  alt,
  label,
}: {
  icon: string
  alt: string
  label: string
}) => (
  <div className='flex-row-gap-2 items-center'>
    <img src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
)

const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>
}) => {
  const { slug } = await params
  const request = await fetch(`${BASE_URl}/api/events/${slug}`)
  const {
    event: {
      description,
      image,
      overview,
      date,
      time,
      location,
      mode,
      agenda,
      audience,
    },
  } = await request.json()

  if (!description) return notFound()

  return (
    <section id='event'>
      <div className='header'>
        <h1>Event Description</h1>
        <p className='mt-2'>{description}</p>
      </div>

      <div className='details'>
        {/* left side - Event content */}
        <div className='content'>
          <img
            src={image}
            alt='Event Banner'
            width={800}
            height={800}
            className='banner'
          />

          <section className='flex-col-gap-2'>
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className='flex-col-gap-2'>
            <h2>Event Details</h2>
            <EventDetailItem
              icon='/icons/calendar.svg'
              alt='calendar'
              label={date}
            />
            <EventDetailItem icon='/icons/clock.svg' alt='time' label={time} />
            <EventDetailItem icon='/icons/pin.svg' alt='pin' label={location} />
            <EventDetailItem icon='/icons/mode.svg' alt='mode' label={mode} />
            <EventDetailItem
              icon='/icons/audience.svg'
              alt='audience'
              label={audience}
            />
          </section>
        </div>

        {/* right side - Booking form */}
        <aside className='booking'>
          <p className='text-lg font-semibold'>Book Event</p>
        </aside>
      </div>
    </section>
  )
}

export default EventDetailsPage

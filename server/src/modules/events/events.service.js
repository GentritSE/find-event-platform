'use strict';

const eventsRepository = require('./events.repository');
const { createEventSchema, updateEventSchema, eventQuerySchema } = require('./events.schema');

class EventsService {
  async listEvents(query) {
    const parsed = eventQuerySchema.parse(query);
    const { data, total } = await eventsRepository.findAll(parsed);
    return {
      data,
      pagination: {
        page: parsed.page,
        limit: parsed.limit,
        total,
        pages: Math.ceil(total / parsed.limit),
      },
    };
  }

  async getEventById(id) {
    const event = await eventsRepository.findById(id);
    if (!event) {
      const err = new Error('Event not found');
      err.status = 404;
      throw err;
    }
    return event;
  }

  async getOrganizerEvents(organizerId, query = {}) {
    return eventsRepository.findByOrganizer(organizerId, query);
  }

  async createEvent(organizerId, body) {
    const data = createEventSchema.parse(body);
    return eventsRepository.create({ ...data, organizer_id: organizerId });
  }

  async updateEvent(id, organizerId, body, role) {
    const data = updateEventSchema.parse(body);
    let updated;
    if (role === 'admin') {
      updated = await eventsRepository.update(id, organizerId, data);
      if (!updated) {
        const { rows } = await require('../../config/db').query(
          `UPDATE events SET ${Object.keys(data).map((k, i) => `${k}=$${i + 1}`).join(', ')}, updated_at=NOW() WHERE id=$${Object.keys(data).length + 1} RETURNING *`,
          [...Object.values(data), id]
        );
        updated = rows[0];
      }
    } else {
      updated = await eventsRepository.update(id, organizerId, data);
    }

    if (!updated) {
      const err = new Error('Event not found or permission denied');
      err.status = 404;
      throw err;
    }
    return updated;
  }

  async publishEvent(id, organizerId, role) {
    const event = await eventsRepository.findById(id);
    if (!event) {
      const err = new Error('Event not found');
      err.status = 404;
      throw err;
    }
    if (role !== 'admin' && event.organizer_id !== organizerId) {
      const err = new Error('Forbidden');
      err.status = 403;
      throw err;
    }
    return eventsRepository.updateStatus(id, 'published');
  }

  async cancelEvent(id, organizerId, role) {
    const event = await eventsRepository.findById(id);
    if (!event) {
      const err = new Error('Event not found');
      err.status = 404;
      throw err;
    }
    if (role !== 'admin' && event.organizer_id !== organizerId) {
      const err = new Error('Forbidden');
      err.status = 403;
      throw err;
    }
    return eventsRepository.updateStatus(id, 'cancelled');
  }

  async deleteEvent(id, organizerId) {
    await eventsRepository.delete(id, organizerId);
  }
}

module.exports = new EventsService();

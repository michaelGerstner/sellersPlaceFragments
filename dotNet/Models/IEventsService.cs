using Models;
using Models.Domain;
using Models.Requests;
using System.Collections.Generic;

namespace Services
{
    public interface IEventsService
    {
        Paged<EventLocation> Select(int pageIndex, int pageSize);

        PromoterProfileFacing Get(int promoterId, int pageIndex, int pageSize);

        EventDetails GetDetails(int eventId);

        Paged<EventWithImage> GetByVendor(int vendorId, int pageIndex, int pageSize);

        Paged<EventWithImage> GetByUser(int pageIndex, int pageSize, int currentUserId);

        void UpdateStatus(int id, int eventStatusId);

        int CopyEvent(int id, int userId);
    }
}
using System;

namespace Models.Domain
{
    public class Event
    {
        public int Id { get; set; }

        public int EventTypeId { get; set; }

        public string Name { get; set; }

        public string Summary { get; set; }

        public string Headline { get; set; }

        public string Description { get; set; }

        public int VenueId { get; set; }

        public int EventStatusId { get; set; }

        public string License { get; set; }

        public bool? IsFree { get; set; }

        public DateTime DateCreated { get; set; }

        public DateTime DateModified { get; set; }

        public DateTime SetupTime { get; set; }

        public DateTime DateStart { get; set; }

        public DateTime DateEnd { get; set; }

        public int PromoterId { get; set; }
    }
}
using System.Collections.Generic;

namespace Models.Domain
{
    public class EventDetails
    {
        public Event Event { get; set; }

        public Venue Venue { get; set; }

        public Location Location { get; set; }

        public Image PrimaryImage { get; set; }

        public List<Image> Images { get; set; }

        public List<OfferingLookup> Offerings { get; set; }
    }
}
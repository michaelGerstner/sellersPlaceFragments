using System;

namespace Models.Domain
{
    public class EventLocation : Event
    {
        public string VenueName { get; set; }

        public string LineOne { get; set; }

        public string LineTwo { get; set; }

        public string City { get; set; }

        public string Zip { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public string MainImage { get; set; }
    }
}
import { Link } from "react-router-dom";
import { Package } from "@/data/packages";
import { MapPin, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";

interface PackageCardProps {
  package: Package;
}

const PackageCard = ({ package: pkg }: PackageCardProps) => {
  const discount = Math.round(((pkg.originalValue - pkg.price) / pkg.originalValue) * 100);

  return (
    <Card className="overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={pkg.image}
          alt={pkg.storeName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{pkg.storeName}</h3>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              {pkg.location}
            </div>
          </div>
          <Badge variant="secondary" className="ml-2">
            {pkg.category}
          </Badge>
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5 mr-1" />
          {pkg.pickupTime}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-primary">
                Rp {pkg.price.toLocaleString('id-ID')}
              </span>
              <Badge className="bg-accent/20 text-accent-foreground hover:bg-accent/20">
                {discount}%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground line-through">
              Rp {pkg.originalValue.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Tersisa</p>
            <p className="text-sm font-semibold">{pkg.available} paket</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link to={`/paket/${pkg.id}`} className="w-full">
          <Button className="w-full">Lihat Paket</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PackageCard;

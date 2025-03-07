"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface LocationSelectorProps {
    control: any;
    provinceField: string;
    districtField: string;
    wardField: string;
}

const LocationSelector = ({ control, provinceField, districtField, wardField }: LocationSelectorProps) => {
    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="province">Tỉnh/Thành phố</Label>
                <Input
                    id="province"
                    placeholder="Nhập tên tỉnh/thành phố"
                    {...control.register(provinceField)}
                />
            </div>

            <div>
                <Label htmlFor="district">Quận/Huyện</Label>
                <Input
                    id="district"
                    placeholder="Nhập tên quận/huyện"
                    {...control.register(districtField)}
                />
            </div>

            <div>
                <Label htmlFor="ward">Phường/Xã</Label>
                <Input
                    id="ward"
                    placeholder="Nhập tên phường/xã"
                    {...control.register(wardField)}
                />
            </div>
        </div>
    );
};

export default LocationSelector;


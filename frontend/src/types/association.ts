export interface Association {
    id: string
    name: string
    description: string | null
    phoneNumber: string | null
    contactEmail: string | null
    address: string | null
    websiteUrl: string | null
    rnaNumber: string | null
    donationUseDescription: string | null
    createdAt: string
    tags: Tag[]
    departments: Department[]
    supportCount: number
}

export interface Tag {
    id: number
    code: string
    label: string
}

export interface Department {
    code: string
    name: string
    region: Region
}

export interface Region {
    code: string
    name: string
}

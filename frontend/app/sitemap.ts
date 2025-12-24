import { MetadataRoute } from 'next'
import { FACE_TYPE_DATA_MAN } from '@/data/faceTypeDataMan'
import { FACE_TYPE_DATA_WOMAN } from '@/data/faceTypeDataWoman'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://facetype16.com'
    
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/face-type`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/mypage`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/login`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
    ]

    const manPages: MetadataRoute.Sitemap = Object.keys(FACE_TYPE_DATA_MAN)
        .filter((code) => code !== 'DEFAULT')
        .map((code) => ({
            url: `${baseUrl}/types/man/${code}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8, 
        }))

    const womanPages: MetadataRoute.Sitemap = Object.keys(FACE_TYPE_DATA_WOMAN)
        .filter((code) => code !== 'DEFAULT')
        .map((code) => ({
            url: `${baseUrl}/types/woman/${code}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        }))

    return [...staticPages, ...manPages, ...womanPages]
}
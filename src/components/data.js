import { useTranslation } from 'react-i18next'
import montessori from '../assets/montessori.jpg'
import montessori2 from '../assets/juguetes-montessori-2.jpg'
import montessori3 from '../assets/services.jpg'

const useInfos = () => {
    const { t } = useTranslation()

    return [
        {
            title: t('home.cardMethodTitle'),
            image: montessori,
            description: t('home.cardMethodDesc'),
            link: "method"
        },
        {
            title: t('home.cardAboutTitle'),
            image: montessori2,
            description: t('home.cardAboutDesc'),
            link: "about"
        },
        {
            title: t('home.cardServicesTitle'),
            image: montessori3,
            description: t('home.cardServicesDesc'),
            link: "services"
        },
    ]
}

export default useInfos

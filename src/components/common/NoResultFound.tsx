import { useTranslation } from "../TranslationContext";

const NoResultFound = () => {
    const { t } = useTranslation();
    return (
        <tr>
            <td colSpan={12} className="text-center py-4 text-gray-500">
                {t('NO_RESULT_FOUND')}
            </td>
        </tr>
    )
}

export default NoResultFound
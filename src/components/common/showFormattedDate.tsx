import { useSettings } from '../SettingsContext';
import helpers from '@/utils/helpers';

export  function showFormattedDate  (date = '') {
    const { settings } = useSettings();
    return date ? helpers.showFormattedDate(date, `${settings?.dateFormat} hh:mm A`) : 'N/A'
}


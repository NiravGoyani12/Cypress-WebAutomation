import { IPropertyAliases } from './types';

export default {
    'Fibre Segment Calibration': 'acquisition\\\\.fibreSegment([\\\\d]+)',
    'Suppression Zones': 'eventDetection.processing.signalSuppressionZone',
    'Monitor Start Distance': 'user.monitor.startDistance',
    'Monitor End Distance': 'user.monitor.endDistance',
    'Monitor Start Position': 'acquisition\\\\.fibreSegment([\\\\d]+)/1/monitorStart_m',
    'Monitor End Position': 'acquisition\\\\.fibreSegment([\\\\d]+)/1/monitorEnd_m',
    'Cable Start': 'acquisition\\\\.fibreSegment([\\\\d]+)/1/start_m',
    'Host Name': 'host_name',
    'Pulse width': 'acquisition.laserPulseWidthSec',
    'Watchdog - After power failure/recovery': 'watchdog:fdel_restart_after_power_failure',
    'Watchdog - After software crash': 'watchdog:fdel_restart_after_fdel_crash',
    'Watchdog - After temperatures return to normal': 'watchdog:fdel_restart_after_temp_overheat',
    'Watchdog - After acquisition error': 'acquisition.autoRestart',
    'Watchdog - On high temperatures': 'watchdog:fdel_stop_on_high_temp',
    'Watchdog - On low disk space': 'watchdog:fdel_stop_on_disk_full',
    'Watchdog - Enable recovery': 'watchdog:recovery_enabled',
    'System serial number': 'identification.helios.serialNumber',
    'System name': 'identification.helios.name',
    'Optics trigger level': 'acquisition.alazar.channelB.trigger.level',
    'Optics box delay': 'acquisition.fibreBoxDelaySec',
    'Custom name': 'identification.custom.name',
    'Custom id': 'identification.custom.id',
    'Streaming - Raw streaming enabled': 'streaming.raw.enabled',
    'Streaming - Raw streaming address': 'streaming.raw.address',
    'Streaming - Raw streaming port': 'streaming.raw.port',
    'Streaming - Acoustic streaming enabled': 'streaming.acoustic.enabled',
    'Streaming - Acoustic streaming address': 'streaming.acoustic.address',
    'Streaming - Acoustic streaming port': 'streaming.acoustic.port',
    'Streaming - Phase streaming enabled': 'streaming.phase.enabled',
    'Streaming - Phase streaming address': 'streaming.phase.address',
    'Streaming - Phase streaming port': 'streaming.phase.port',
    'System health visuals': 'systemhealth_visuals',
    'System health details': 'systemhealth_details',
    'Orientation': 'fibre_graph_orientation',
    'Acoustic high pass cut off': 'acoustic.signal.highPass.cutoff_Hz',
    'Optics pulse repetition frequency': 'acquisition.laserPulseRate',
    'Distance': 'units_distance',
    'Physical fibre length': 'length'
} as IPropertyAliases;

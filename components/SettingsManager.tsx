import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { UserPreferencesService, useUserPreferences, DeviceConfig } from '@/services/userPreferencesService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Monitor, 
  Download, 
  BarChart3, 
  Bell, 
  Palette, 
  Code, 
  Shield,
  Keyboard,
  History,
  Globe,
  Save,
  RotateCcw,
  Upload,
  DownloadCloud,
  Plus,
  Trash2,
  Star,
  StarOff,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

const SettingsManager: React.FC = () => {
  const { t } = useTranslation();
  const { preferences, updatePreferences } = useUserPreferences();
  const [activeTab, setActiveTab] = useState('general');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customDevice, setCustomDevice] = useState<Partial<DeviceConfig>>({
    name: '',
    width: 1920,
    height: 1080,
    pixelDensity: 1,
    category: 'custom',
    description: ''
  });

  const service = useMemo(() => UserPreferencesService.getInstance(), []);

  const handlePreferenceChange = useCallback((key: string, value: any) => {
    const keys = key.split('.');
    const updatedPrefs = { ...preferences };
    
    let current = updatedPrefs as any;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    updatePreferences(updatedPrefs);
  }, [preferences, updatePreferences]);

  const handleAddCustomDevice = useCallback(() => {
    if (!customDevice.name || !customDevice.width || !customDevice.height) {
      toast.error(t('settings.devices.validation.required'));
      return;
    }

    const device: DeviceConfig = {
      id: `custom-${Date.now()}`,
      name: customDevice.name,
      width: customDevice.width,
      height: customDevice.height,
      pixelDensity: customDevice.pixelDensity || 1,
      category: 'custom',
      description: customDevice.description || '',
      isCustom: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    service.addCustomDevice(device);
    setCustomDevice({
      name: '',
      width: 1920,
      height: 1080,
      pixelDensity: 1,
      category: 'custom',
      description: ''
    });
    toast.success(t('settings.devices.added'));
  }, [customDevice, service, t]);

  const handleRemoveCustomDevice = useCallback((deviceId: string) => {
    service.removeCustomDevice(deviceId);
    toast.success(t('settings.devices.removed'));
  }, [service, t]);

  const handleExportSettings = useCallback(() => {
    const settings = service.exportSettings();
    const blob = new Blob([settings], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `app-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(t('settings.export.success'));
  }, [service, t]);

  const handleImportSettings = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settings = e.target?.result as string;
        const success = service.importSettings(settings);
        if (success) {
          toast.success(t('settings.import.success'));
        } else {
          toast.error(t('settings.import.error'));
        }
      } catch (error) {
        toast.error(t('settings.import.error'));
      }
    };
    reader.readAsText(file);
  }, [service, t]);

  const handleResetSettings = useCallback(() => {
    if (window.confirm(t('settings.reset.confirm'))) {
      service.resetToDefaults();
      toast.success(t('settings.reset.success'));
    }
  }, [service, t]);

  const GeneralSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="language">{t('settings.general.language')}</Label>
          <Select
            value={preferences.language}
            onValueChange={(value) => handlePreferenceChange('language', value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="zh">中文</SelectItem>
              <SelectItem value="ja">日本語</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="theme">{t('settings.general.theme')}</Label>
          <Select
            value={preferences.theme}
            onValueChange={(value) => handlePreferenceChange('theme', value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">{t('settings.theme.light')}</SelectItem>
              <SelectItem value="dark">{t('settings.theme.dark')}</SelectItem>
              <SelectItem value="auto">{t('settings.theme.auto')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="autoSave">{t('settings.general.autoSave')}</Label>
            <p className="text-sm text-muted-foreground">{t('settings.general.autoSaveDescription')}</p>
          </div>
          <Switch
            id="autoSave"
            checked={preferences.autoSave}
            onCheckedChange={(checked) => handlePreferenceChange('autoSave', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="autoProcess">{t('settings.general.autoProcess')}</Label>
            <p className="text-sm text-muted-foreground">{t('settings.general.autoProcessDescription')}</p>
          </div>
          <Switch
            id="autoProcess"
            checked={preferences.autoProcess}
            onCheckedChange={(checked) => handlePreferenceChange('autoProcess', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="fontSize">{t('settings.ui.fontSize')}</Label>
          <Select
            value={preferences.ui.fontSize}
            onValueChange={(value) => handlePreferenceChange('ui.fontSize', value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">{t('settings.fontSize.small')}</SelectItem>
              <SelectItem value="medium">{t('settings.fontSize.medium')}</SelectItem>
              <SelectItem value="large">{t('settings.fontSize.large')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const ProcessingSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="defaultFormat">{t('settings.processing.defaultFormat')}</Label>
          <Select
            value={preferences.processing.defaultFormat}
            onValueChange={(value) => handlePreferenceChange('processing.defaultFormat', value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="webp">WebP</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpg">JPG</SelectItem>
              <SelectItem value="avif">AVIF</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="compressionQuality">{t('settings.processing.compressionQuality')}: {preferences.processing.compressionQuality}%</Label>
          <Slider
            id="compressionQuality"
            min={1}
            max={100}
            value={[preferences.processing.compressionQuality]}
            onValueChange={(value) => handlePreferenceChange('processing.compressionQuality', value[0])}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="parallelTasks">{t('settings.processing.parallelTasks')}: {preferences.processing.parallelTasks}</Label>
          <Slider
            id="parallelTasks"
            min={1}
            max={16}
            value={[preferences.processing.parallelTasks]}
            onValueChange={(value) => handlePreferenceChange('processing.parallelTasks', value[0])}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="memoryLimit">{t('settings.processing.memoryLimit')}: {preferences.processing.memoryLimit} MB</Label>
          <Slider
            id="memoryLimit"
            min={128}
            max={4096}
            step={64}
            value={[preferences.processing.memoryLimit]}
            onValueChange={(value) => handlePreferenceChange('processing.memoryLimit', value[0])}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="gpuAcceleration">{t('settings.processing.gpuAcceleration')}</Label>
            <p className="text-sm text-muted-foreground">{t('settings.processing.gpuAccelerationDescription')}</p>
          </div>
          <Switch
            id="gpuAcceleration"
            checked={preferences.processing.enableGPUAcceleration}
            onCheckedChange={(checked) => handlePreferenceChange('processing.enableGPUAcceleration', checked)}
          />
        </div>
      </div>
    </div>
  );

  const DeviceSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{t('settings.devices.customDevices')}</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="deviceName">{t('settings.devices.name')}</Label>
            <Input
              id="deviceName"
              value={customDevice.name || ''}
              onChange={(e) => setCustomDevice(prev => ({ ...prev, name: e.target.value }))}
              placeholder={t('settings.devices.namePlaceholder')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deviceWidth">{t('settings.devices.width')}</Label>
            <Input
              id="deviceWidth"
              type="number"
              value={customDevice.width || 1920}
              onChange={(e) => setCustomDevice(prev => ({ ...prev, width: parseInt(e.target.value) }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deviceHeight">{t('settings.devices.height')}</Label>
            <Input
              id="deviceHeight"
              type="number"
              value={customDevice.height || 1080}
              onChange={(e) => setCustomDevice(prev => ({ ...prev, height: parseInt(e.target.value) }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deviceDensity">{t('settings.devices.pixelDensity')}</Label>
            <Input
              id="deviceDensity"
              type="number"
              step="0.1"
              value={customDevice.pixelDensity || 1}
              onChange={(e) => setCustomDevice(prev => ({ ...prev, pixelDensity: parseFloat(e.target.value) }))}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="deviceDescription">{t('settings.devices.description')}</Label>
          <Input
            id="deviceDescription"
            value={customDevice.description || ''}
            onChange={(e) => setCustomDevice(prev => ({ ...prev, description: e.target.value }))}
            placeholder={t('settings.devices.descriptionPlaceholder')}
          />
        </div>
        
        <Button onClick={handleAddCustomDevice} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          {t('settings.devices.add')}
        </Button>
      </div>

      {preferences.devices.customDevices.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t('settings.devices.existing')}</h3>
          <div className="space-y-2">
            {preferences.devices.customDevices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="font-medium">{device.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {device.width} × {device.height} @ {device.pixelDensity}x
                    </p>
                    {device.description && (
                      <p className="text-xs text-muted-foreground">{device.description}</p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveCustomDevice(device.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const ExportSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="exportFormat">{t('settings.export.format')}</Label>
          <Select
            value={preferences.export.defaultFormat}
            onValueChange={(value) => handlePreferenceChange('export.defaultFormat', value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpg">JPG</SelectItem>
              <SelectItem value="webp">WebP</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="exportQuality">{t('settings.export.quality')}: {preferences.export.quality}%</Label>
          <Slider
            id="exportQuality"
            min={1}
            max={100}
            value={[preferences.export.quality]}
            onValueChange={(value) => handlePreferenceChange('export.quality', value[0])}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="includeMetadata">{t('settings.export.includeMetadata')}</Label>
            <p className="text-sm text-muted-foreground">{t('settings.export.includeMetadataDescription')}</p>
          </div>
          <Switch
            id="includeMetadata"
            checked={preferences.export.includeMetadata}
            onCheckedChange={(checked) => handlePreferenceChange('export.includeMetadata', checked)}
          />
        </div>

        <div className="space-y-4 border rounded-lg p-4">
          <h4 className="font-medium">{t('settings.export.watermark.title')}</h4>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="watermarkEnabled">{t('settings.export.watermark.enabled')}</Label>
            <Switch
              id="watermarkEnabled"
              checked={preferences.export.watermark.enabled}
              onCheckedChange={(checked) => handlePreferenceChange('export.watermark.enabled', checked)}
            />
          </div>

          {preferences.export.watermark.enabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="watermarkText">{t('settings.export.watermark.text')}</Label>
                <Input
                  id="watermarkText"
                  value={preferences.export.watermark.text}
                  onChange={(e) => handlePreferenceChange('export.watermark.text', e.target.value)}
                  placeholder={t('settings.export.watermark.textPlaceholder')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="watermarkPosition">{t('settings.export.watermark.position')}</Label>
                <Select
                  value={preferences.export.watermark.position}
                  onValueChange={(value) => handlePreferenceChange('export.watermark.position', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top-left">{t('settings.position.topLeft')}</SelectItem>
                    <SelectItem value="top-right">{t('settings.position.topRight')}</SelectItem>
                    <SelectItem value="bottom-left">{t('settings.position.bottomLeft')}</SelectItem>
                    <SelectItem value="bottom-right">{t('settings.position.bottomRight')}</SelectItem>
                    <SelectItem value="center">{t('settings.position.center')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="watermarkOpacity">{t('settings.export.watermark.opacity')}: {preferences.export.watermark.opacity}</Label>
                <Slider
                  id="watermarkOpacity"
                  min={0.1}
                  max={1}
                  step={0.1}
                  value={[preferences.export.watermark.opacity]}
                  onValueChange={(value) => handlePreferenceChange('export.watermark.opacity', value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="watermarkFontSize">{t('settings.export.watermark.fontSize')}: {preferences.export.watermark.fontSize}px</Label>
                <Slider
                  id="watermarkFontSize"
                  min={8}
                  max={72}
                  value={[preferences.export.watermark.fontSize]}
                  onValueChange={(value) => handlePreferenceChange('export.watermark.fontSize', value[0])}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const NotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="emailNotifications">{t('settings.notifications.email')}</Label>
            <p className="text-sm text-muted-foreground">{t('settings.notifications.emailDescription')}</p>
          </div>
          <Switch
            id="emailNotifications"
            checked={preferences.notifications.emailNotifications}
            onCheckedChange={(checked) => handlePreferenceChange('notifications.emailNotifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="pushNotifications">{t('settings.notifications.push')}</Label>
            <p className="text-sm text-muted-foreground">{t('settings.notifications.pushDescription')}</p>
          </div>
          <Switch
            id="pushNotifications"
            checked={preferences.notifications.pushNotifications}
            onCheckedChange={(checked) => handlePreferenceChange('notifications.pushNotifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="soundEnabled">{t('settings.notifications.sound')}</Label>
            <p className="text-sm text-muted-foreground">{t('settings.notifications.soundDescription')}</p>
          </div>
          <Switch
            id="soundEnabled"
            checked={preferences.notifications.soundEnabled}
            onCheckedChange={(checked) => handlePreferenceChange('notifications.soundEnabled', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="desktopNotifications">{t('settings.notifications.desktop')}</Label>
            <p className="text-sm text-muted-foreground">{t('settings.notifications.desktopDescription')}</p>
          </div>
          <Switch
            id="desktopNotifications"
            checked={preferences.notifications.desktopNotifications}
            onCheckedChange={(checked) => handlePreferenceChange('notifications.desktopNotifications', checked)}
          />
        </div>

        <Separator />

        <h4 className="font-medium">{t('settings.notifications.events')}</h4>

        <div className="flex items-center justify-between">
          <Label htmlFor="processingComplete">{t('settings.notifications.processingComplete')}</Label>
          <Switch
            id="processingComplete"
            checked={preferences.notifications.processingComplete}
            onCheckedChange={(checked) => handlePreferenceChange('notifications.processingComplete', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="batchComplete">{t('settings.notifications.batchComplete')}</Label>
          <Switch
            id="batchComplete"
            checked={preferences.notifications.batchComplete}
            onCheckedChange={(checked) => handlePreferenceChange('notifications.batchComplete', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="exportComplete">{t('settings.notifications.exportComplete')}</Label>
          <Switch
            id="exportComplete"
            checked={preferences.notifications.exportComplete}
            onCheckedChange={(checked) => handlePreferenceChange('notifications.exportComplete', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="errorAlerts">{t('settings.notifications.errorAlerts')}</Label>
          <Switch
            id="errorAlerts"
            checked={preferences.notifications.errorAlerts}
            onCheckedChange={(checked) => handlePreferenceChange('notifications.errorAlerts', checked)}
          />
        </div>
      </div>
    </div>
  );

  const PrivacySettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="shareUsageData">{t('settings.privacy.shareUsageData')}</Label>
            <p className="text-sm text-muted-foreground">{t('settings.privacy.shareUsageDataDescription')}</p>
          </div>
          <Switch
            id="shareUsageData"
            checked={preferences.privacy.shareUsageData}
            onCheckedChange={(checked) => handlePreferenceChange('privacy.shareUsageData', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="allowCookies">{t('settings.privacy.allowCookies')}</Label>
            <p className="text-sm text-muted-foreground">{t('settings.privacy.allowCookiesDescription')}</p>
          </div>
          <Switch
            id="allowCookies"
            checked={preferences.privacy.allowCookies}
            onCheckedChange={(checked) => handlePreferenceChange('privacy.allowCookies', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="rememberMe">{t('settings.privacy.rememberMe')}</Label>
            <p className="text-sm text-muted-foreground">{t('settings.privacy.rememberMeDescription')}</p>
          </div>
          <Switch
            id="rememberMe"
            checked={preferences.privacy.rememberMe}
            onCheckedChange={(checked) => handlePreferenceChange('privacy.rememberMe', checked)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sessionTimeout">{t('settings.privacy.sessionTimeout')}: {preferences.privacy.sessionTimeout} {t('common.minutes')}</Label>
          <Slider
            id="sessionTimeout"
            min={5}
            max={1440}
            step={5}
            value={[preferences.privacy.sessionTimeout]}
            onValueChange={(value) => handlePreferenceChange('privacy.sessionTimeout', value[0])}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataRetention">{t('settings.privacy.dataRetention')}: {preferences.privacy.dataRetention} {t('common.days')}</Label>
          <Slider
            id="dataRetention"
            min={1}
            max={3650}
            step={30}
            value={[preferences.privacy.dataRetention]}
            onValueChange={(value) => handlePreferenceChange('privacy.dataRetention', value[0])}
          />
        </div>
      </div>
    </div>
  );

  const AdvancedSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="debugMode">{t('settings.advanced.debugMode')}</Label>
            <p className="text-sm text-muted-foreground">{t('settings.advanced.debugModeDescription')}</p>
          </div>
          <Switch
            id="debugMode"
            checked={preferences.advanced.debugMode}
            onCheckedChange={(checked) => handlePreferenceChange('advanced.debugMode', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="experimentalFeatures">{t('settings.advanced.experimentalFeatures')}</Label>
            <p className="text-sm text-muted-foreground">{t('settings.advanced.experimentalFeaturesDescription')}</p>
          </div>
          <Switch
            id="experimentalFeatures"
            checked={preferences.advanced.experimentalFeatures}
            onCheckedChange={(checked) => handlePreferenceChange('advanced.experimentalFeatures', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="performanceMode">{t('settings.advanced.performanceMode')}</Label>
            <p className="text-sm text-muted-foreground">{t('settings.advanced.performanceModeDescription')}</p>
          </div>
          <Switch
            id="performanceMode"
            checked={preferences.advanced.performanceMode}
            onCheckedChange={(checked) => handlePreferenceChange('advanced.performanceMode', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="cacheEnabled">{t('settings.advanced.cacheEnabled')}</Label>
            <p className="text-sm text-muted-foreground">{t('settings.advanced.cacheEnabledDescription')}</p>
          </div>
          <Switch
            id="cacheEnabled"
            checked={preferences.advanced.cacheEnabled}
            onCheckedChange={(checked) => handlePreferenceChange('advanced.cacheEnabled', checked)}
          />
        </div>

        {preferences.advanced.cacheEnabled && (
          <div className="space-y-2">
            <Label htmlFor="cacheSize">{t('settings.advanced.cacheSize')}: {preferences.advanced.cacheSize} MB</Label>
            <Slider
              id="cacheSize"
              min={10}
              max={1000}
              step={10}
              value={[preferences.advanced.cacheSize]}
              onValueChange={(value) => handlePreferenceChange('advanced.cacheSize', value[0])}
            />
          </div>
        )}

        {showAdvanced && (
          <div className="space-y-4 border rounded-lg p-4">
            <h4 className="font-medium">{t('settings.advanced.customCSS')}</h4>
            <div className="space-y-2">
              <Label htmlFor="customCSS">{t('settings.advanced.customCSS')}</Label>
              <textarea
                id="customCSS"
                value={preferences.advanced.customCSS}
                onChange={(e) => handlePreferenceChange('advanced.customCSS', e.target.value)}
                className="w-full h-32 p-2 border rounded-md font-mono text-sm"
                placeholder={t('settings.advanced.customCSSPlaceholder')}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('settings.title')}</h1>
        <p className="text-muted-foreground">{t('settings.description')}</p>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportSettings}>
            <DownloadCloud className="h-4 w-4 mr-2" />
            {t('settings.export.title')}
          </Button>
          
          <Button variant="outline" onClick={() => document.getElementById('importFile')?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            {t('settings.import.title')}
          </Button>
          
          <input
            id="importFile"
            type="file"
            accept=".json"
            onChange={handleImportSettings}
            className="hidden"
          />
          
          <Button variant="destructive" onClick={handleResetSettings}>
            <RotateCcw className="h-4 w-4 mr-2" />
            {t('settings.reset.title')}
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
          {showAdvanced ? t('settings.hideAdvanced') : t('settings.showAdvanced')}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          <TabsTrigger value="general" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>{t('settings.tabs.general')}</span>
          </TabsTrigger>
          <TabsTrigger value="processing" className="flex items-center space-x-2">
            <Monitor className="h-4 w-4" />
            <span>{t('settings.tabs.processing')}</span>
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex items-center space-x-2">
            <Monitor className="h-4 w-4" />
            <span>{t('settings.tabs.devices')}</span>
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>{t('settings.tabs.export')}</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>{t('settings.tabs.notifications')}</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>{t('settings.tabs.privacy')}</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center space-x-2">
            <Code className="h-4 w-4" />
            <span>{t('settings.tabs.advanced')}</span>
          </TabsTrigger>
          {showAdvanced && (
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>{t('settings.tabs.analytics')}</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>{t('settings.general.title')}</span>
              </CardTitle>
              <CardDescription>{t('settings.general.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <GeneralSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="h-5 w-5" />
                <span>{t('settings.processing.title')}</span>
              </CardTitle>
              <CardDescription>{t('settings.processing.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ProcessingSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="h-5 w-5" />
                <span>{t('settings.devices.title')}</span>
              </CardTitle>
              <CardDescription>{t('settings.devices.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <DeviceSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>{t('settings.export.title')}</span>
              </CardTitle>
              <CardDescription>{t('settings.export.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ExportSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>{t('settings.notifications.title')}</span>
              </CardTitle>
              <CardDescription>{t('settings.notifications.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>{t('settings.privacy.title')}</span>
              </CardTitle>
              <CardDescription>{t('settings.privacy.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <PrivacySettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="h-5 w-5" />
                <span>{t('settings.advanced.title')}</span>
              </CardTitle>
              <CardDescription>{t('settings.advanced.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <AdvancedSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsManager;
# In order for this to work, you need to login to azure using the azure powershell cli and 
# set as default the subscription that contains the function app and resource group

# Reads a function app's environment variables
"The content will be copied to your clipboard once completed."
"You should paste the content to your .env file of your backend project under src folder."
$functionappName = Read-Host -Prompt "Please enter the function app name"
$rgName = Read-Host -Prompt "Please enter the resource group name"

Write-Progress -Activity "Fetching environment data for function app $functionappName" -PercentComplete 0 -Status "Pending"
$configs = az functionapp config appsettings list --name $functionappName --resource-group $rgName | ConvertFrom-Json
$lines = @()
$idx = 0

foreach ($config in $configs) { 
    $percentComplete = ($idx / $configs.Count) * 100
    Write-Progress -Activity "Fetching environment data for function app $functionappName " -Status "Processing $percentComplete%" -PercentComplete $percentComplete
    # if value starts with @Microsoft.KeyVault, read the value from key vault
    # the kv value has this shape "@Microsoft.KeyVault(SecretUri=https://fouly-dev-kv.vault.azure.net/secrets/FOULY-NOSQL-CONNECTION-STRING/7f891ed93830483eac3bca5e0637dce7)"
    if ($config.value.startsWith('@Microsoft.KeyVault')) {
        $kvAddressId = $config.value.split('=')[1]
        $kvAddressId = $kvAddressId.subString(0, $kvAddressId.length - 1)
        $secret = az keyvault secret show --id $kvAddressId | ConvertFrom-Json
        $lines += $secret.name + "=" + $secret.value
    }
    else {
        #otherwise, take the value as is without the double quotes
        $lines += $config.name + "=" + $config.value;
    }
    $idx++
} 

Set-Clipboard -Value $lines
$lines